# 130 — Custom useFetch Hook

## Problem Statement

Extract all the async fetch logic you have been writing across these problems into a reusable `useFetch` hook. The hook takes a URL and returns `{ data, loading, error, refetch }`. It must handle: automatic fetch on mount, AbortController cleanup on unmount or URL change, and a `refetch` function the caller can invoke to manually re-trigger the request.

---

## Expected Behavior

- `const { data, loading, error, refetch } = useFetch(url)`
- Fetches automatically when `url` changes or on mount.
- Cancels the in-flight request if `url` changes before it resolves.
- Returns `loading: true` while in-flight.
- Returns `error` (string) if the request fails.
- `refetch()` re-runs the same request manually (e.g., for retry buttons).
- Changing `url` from outside resets data/error and starts a new fetch.

---

## Required Concepts

- Custom hook encapsulating `useEffect`, `useState`, `useRef`
- `AbortController` — created per fetch, cancelled on cleanup
- `useCallback` — memoize the `refetch` function so it has a stable reference
- A trigger mechanism to allow `refetch()` without changing the URL: use a `fetchCount` ref that increments on each `refetch()` call, added to the `useEffect` dependency array

---

## Constraints

- The hook must be generic — it takes any URL string and returns typed data (or `unknown` if not typed).
- `refetch` must not cause an infinite loop when used in a `useEffect` dependency array.
- The hook must not expose internal state — only `{ data, loading, error, refetch }`.

---

## Edge Cases to Consider

- What if the URL passed in is an empty string — should the fetch fire?
- What if `refetch()` is called while a previous fetch is still in-flight?
- What if the component using the hook unmounts immediately after calling `refetch()`?

---

## Bonus

Once the hook works, use it to rewrite your solution from Problem 116 (Basic Async Fetch) in 10 lines or less.
