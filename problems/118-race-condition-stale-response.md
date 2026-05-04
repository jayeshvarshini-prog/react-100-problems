# 118 — Race Condition: Stale Response Fix

## Problem Statement

Build a country info lookup. The user types a country name in an input and results are fetched from a public API as they type (debounced 400ms). You will intentionally simulate slow/fast responses using artificial delays. The problem: if the user types "in", waits, then types "india" quickly, the "in" response might arrive after "india" and overwrite the correct result with stale data.

Use `useRef` to track the latest request and discard responses that are no longer current.

---

## Expected Behavior

- Input is debounced 400ms before triggering a fetch.
- Only the result for the most recently typed query is ever displayed.
- A stale response (one that arrives after a newer request was made) is silently discarded.
- Loading state clears only when the current request finishes, not a stale one.

---

## Required Concepts

- `useRef` — store a request ID counter; increment on each new fetch; close over the ID at fetch time; compare on response to decide whether to apply it
- `useEffect` debounce pattern with `setTimeout` + cleanup
- `async/await` with `try/catch`
- `useState` — results, loading, error

---

## Constraints

- Do not use AbortController for this problem — solve it with the ref-based ignore flag pattern instead.
- You must be able to demonstrate the bug first (without the fix), then apply the fix.
- Simulate variable response delays with `setTimeout` inside your mock fetch to make the race visible.

---

## Edge Cases to Consider

- What if the user clears the input entirely while a fetch is in-flight?
- What if two fetches resolve in the exact same millisecond?
- Does your loading state go false correctly when a stale response is discarded?
