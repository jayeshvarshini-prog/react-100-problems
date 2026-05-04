# 124 — Live Search: Debounce + Real API + Cancel + Error (The Full Pattern)

## Problem Statement

This is the complete interview-level live search. Build a search input that fetches results from a real API (use `https://dummyjson.com/products/search?q=<query>`). It must handle all of the following simultaneously: debounce (400ms), request cancellation on new input, race condition prevention, distinct error vs empty states, and no setState after unmount.

This is the problem that interviewers ask expecting most candidates to fail at least one requirement.

---

## Expected Behavior

- User types → 400ms debounce → fetch fires with AbortController signal.
- If user types again before 400ms, the timer resets (debounce). If they type after the fetch started, the previous fetch is aborted.
- Only the latest request's result is ever shown.
- While fetching: show a spinner inside the input (or below it).
- On success with results: show the list.
- On success with zero results: show "No results for X."
- On error (not abort): show "Search failed. Try again."
- On empty input: clear results immediately, cancel any in-flight fetch.
- Unmounting mid-fetch must not cause a setState warning.

---

## Required Concepts

- `useEffect` debounce with `setTimeout` cleanup
- `AbortController` — new controller per fetch, stored in `useRef`
- Abort error detection: `error.name === 'AbortError'`
- `useRef` — abort controller, mounted flag
- `useState` — query, results, loading, error

---

## Constraints

- No debounce library — implement it manually with `setTimeout`.
- No search library — use plain `fetch` or Axios with the abort signal.
- The abort and the debounce timer must both be cancelled in the same `useEffect` cleanup.

---

## The Checklist Interviewers Use

- [ ] Debounce works (no fetch on every keystroke)
- [ ] Previous fetch cancelled on new input
- [ ] Stale response never shown
- [ ] Empty input clears results
- [ ] Error state is separate from empty state
- [ ] No memory leak / setState after unmount
- [ ] Loading state is accurate throughout
