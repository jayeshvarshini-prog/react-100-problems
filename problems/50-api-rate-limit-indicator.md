# 50 — API Rate Limit Indicator and Request Throttling

## Problem Statement

You are building a rate limit indicator for a developer dashboard in an API platform. Every API response includes `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers. The dashboard reads these headers from every API response and displays a live rate limit gauge in the header. When remaining requests drop below 20%, a warning banner appears. When the limit is hit (0 remaining), all API calls are queued and retried after the reset timestamp.

---

## Expected Behavior

- Every API response is intercepted to extract `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers.
- A header gauge shows "247 / 1000 requests remaining" with a color-coded bar (green → yellow → red).
- When remaining drops below 20% (200 requests), a yellow warning banner appears.
- When remaining hits 0, a red banner appears: "Rate limit reached. Retrying after HH:MM:SS."
- A countdown in the banner ticks to the reset timestamp.
- Queued requests are retried automatically after the reset, in the order they were queued.
- Gauge updates in real time as requests are made.

---

## Required React Concepts

- `useState` — remaining count, limit, resetTimestamp, queue
- `useEffect` — countdown timer using setInterval when rate limit is hit; auto-retry queue after reset
- `useRef` — countdown interval ID; request queue array
- `useMemo` — derive percentage remaining; derive warning/critical thresholds; derive countdown display string
- `useContext` — provide rate limit state and the wrapped fetch function to the entire app
- Custom hook (`useRateLimit`) — expose `{ remaining, limit, resetAt, isLimited }` and the rate-limit-aware `apiFetch` function

---

## Constraints

- The fetch wrapper must read response headers after every call and update the rate limit context.
- When rate limited, `apiFetch` must return a Promise that does not resolve until the reset and retry succeed.
- The queue must preserve the original request parameters and the resolve/reject callbacks of each queued promise.
- No external HTTP client libraries — wrap native `fetch`.

---

## Edge Cases to Consider

- 10 requests fire simultaneously and all get rate-limited — all 10 must be queued, not each triggering their own timer.
- Reset timestamp is in the past (clock skew) — retry immediately.
- Queued request fails after retry (non-rate-limit error) — reject that promise with the server error.
- Component consuming `remaining` count re-renders on every API call — use `useMemo` to minimize renders.
- Rate limit headers absent from some responses (e.g., public endpoints) — must not reset the counter to undefined.
- User navigates away while requests are queued — queued promises are abandoned; do not leak.
