# 68 — Retry Failed Request UI with Exponential Backoff

## Problem Statement

You are building a resilient data-fetching layer for a dashboard that must handle intermittent API failures gracefully. When a request fails, it must be automatically retried with exponential backoff (1s, 2s, 4s, 8s — max 3 retries). During retry countdown, the UI shows "Retrying in Xs…" with a cancel button. After max retries, the UI shows a persistent error state with a manual "Try Again" button. All of this must be encapsulated in a reusable hook.

---

## Expected Behavior

- On mount, the component fetches its data.
- If the fetch fails, retry 1 begins automatically after 1 second. "Retrying in 1s…" is shown.
- Retry 2 waits 2 seconds, retry 3 waits 4 seconds.
- After retry 3 fails, the component shows a permanent error message with a "Try Again" button (resets to retry 1 on next failure).
- A "Cancel" button during the countdown aborts the pending retry (user sees the manual error state immediately).
- A successful retry clears the error and renders the data normally.
- A "Try Again" button on the permanent error state resets retry attempts and starts over.

---

## Required React Concepts

- `useState` — data, error, retry count, seconds-until-retry countdown
- `useEffect` — countdown timer (1-second ticks); schedule retry after countdown hits 0; clean up on unmount or cancel
- `useRef` — countdown interval ID; retry timeout ID; AbortController for in-flight requests
- `useCallback` — memoize cancel, manual retry, fetch handlers
- Custom hook (`useRetryFetch`) — accept `url` and options; return `{ data, error, isLoading, retryCount, countdown, cancel, retry }`

---

## Constraints

- The hook must be generic — work with any URL, not just one specific endpoint.
- Retry delays must use exponential backoff: `2^(retryCount - 1)` seconds (1, 2, 4, 8...).
- The countdown tick and the retry trigger must be two separate timers.
- On unmount, all timers must be cleared and the in-flight request must be aborted.

---

## Edge Cases to Consider

- Cancel pressed on retry 1 — must immediately show permanent error state (no further retries).
- Retry succeeds on attempt 2 — retry count must reset to 0 for the next failure.
- Component remounts while a retry countdown is in progress — the previous countdown must have been cleaned up on unmount.
- Network comes back online after max retries reached — manual "Try Again" must work.
- All 3 retries fire within 7 seconds; server comes back on retry 3 — must resolve successfully.
- Non-retryable error (404) — should not retry; fail immediately with the appropriate error.
