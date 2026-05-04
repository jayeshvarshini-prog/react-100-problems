# 119 — AbortController: Cancelling In-Flight Requests

## Problem Statement

Build a product search component. The user types in an input; after a 400ms debounce, a fetch is made to a products API. Every time a new fetch starts, the previous one must be cancelled using `AbortController`. On component unmount, the in-flight request must also be cancelled.

---

## Expected Behavior

- User types → debounce 400ms → fetch starts.
- If the user types again before the fetch resolves, the previous fetch is aborted and a new one starts.
- No stale results ever appear.
- Unmounting the component cancels any in-flight request.
- Aborted fetches do not trigger the error state — only real failures do.

---

## Required Concepts

- `AbortController` and `signal` passed to `fetch()` or `axios.get({ signal })`
- `useEffect` cleanup returning a function that calls `controller.abort()`
- Distinguishing abort errors: `error.name === 'AbortError'` (fetch) or `axios.isCancel(error)` (axios)
- `useRef` — hold the controller across renders without causing re-renders

---

## Constraints

- The abort must happen in the `useEffect` cleanup, not manually.
- Aborted requests must NOT set error state.
- Use either native `fetch` or Axios — but know which abort API each uses.

---

## Edge Cases to Consider

- What if the user types, then immediately clears the input — does the abort still fire?
- What happens if you abort a request that has already completed?
- Does aborting affect the debounce timer, or just the fetch itself?
