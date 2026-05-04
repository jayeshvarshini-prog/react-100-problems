# 116 — Basic Async Fetch with Try/Catch

## Problem Statement

Build a user profile card that fetches a single user from `https://jsonplaceholder.typicode.com/users/1` on mount. Display the user's name, email, and company name. While loading, show a spinner. If the fetch fails, show an error message with a retry button that re-triggers the fetch.

---

## Expected Behavior

- On mount, the fetch begins and a loading spinner is shown.
- On success, the user card renders with name, email, and company.
- On failure, the spinner is replaced by an error message and a "Retry" button.
- Clicking Retry re-runs the fetch from scratch (loading → success or error again).

---

## Required Concepts

- `async/await` inside a regular function called from `useEffect`
- `try/catch/finally` — loading state must turn off in `finally`, not in try alone
- `useState` — data, loading, error
- `useEffect` — trigger on mount

---

## Constraints

- Do not use `.then()` / `.catch()` chains — use `async/await` with `try/catch` only.
- The loading spinner must disappear even if the fetch throws — use `finally`.
- Do not call `setState` after the component has unmounted.

---

## Edge Cases to Consider

- What if `finally` runs but the component is already unmounted? (leads to memory leak warning)
- What does your error state show — a raw Error object or a user-friendly string?
- What happens if you click Retry while a fetch is already in-flight?
