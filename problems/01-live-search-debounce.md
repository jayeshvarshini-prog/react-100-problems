# 01 — Live Search with Debounce

## Problem Statement

You are building a global search bar for a SaaS admin dashboard. As the user types in the search input, results should be fetched from an API endpoint and displayed in a dropdown list below the input. To avoid hammering the API on every keystroke, the fetch must be debounced by 400ms. The dropdown must close when the user clicks outside of it, and should display a loading spinner during fetch. If no results are returned, show a "No results found" message.

---

## Expected Behavior

- Typing in the input triggers a debounced API call after 400ms of inactivity.
- While the API call is in-flight, a spinner appears inside the input field.
- Results are rendered in a dropdown list beneath the input.
- Clicking a result navigates to that resource's detail page (simulate with console.log or a callback prop).
- Clicking outside the dropdown closes it.
- Pressing Escape clears the input and closes the dropdown.
- If the input is cleared, any in-flight request is cancelled and the dropdown closes.

---

## Where to Start — Interview Approach

### Step 1: State shape first
Ask yourself what changes over time in this UI:
```
{
  query: '',          // controlled input value
  results: [],        // fetched data
  loading: false,     // spinner visibility
  open: false,        // dropdown visibility
  error: null,        // fetch error message
}
```

### Step 2: Identify effects
- Effect 1: When `query` changes, set a 400ms timer. On timer fire, call the API.
- Effect 2: On mount, attach a `mousedown` listener to `document` for outside-click detection.

### Step 3: Identify refs
- Debounce timer ID → `useRef` (changing it must not re-render the component)
- AbortController → `useRef` (to cancel stale fetches)
- Dropdown container → `useRef` (for outside-click detection)

### Step 4: Component skeleton order
```
1. Declare state (query, results, loading, open, error)
2. Declare refs (timerRef, controllerRef, containerRef)
3. Write the JSX structure first (input + dropdown shell)
4. Wire input onChange → setQuery
5. Add the debounce useEffect
6. Add the fetch inside the timer callback
7. Add the outside-click useEffect
8. Add Escape key handler
9. Add loading/error/empty states in the dropdown
```

---

## Required React Concepts

- `useState` — manage input value, results array, loading state, and open/closed state
- `useEffect` — set up and tear down the debounce timer; cancel fetch on cleanup
- `useRef` — hold reference to the dropdown container for outside-click detection; hold reference to the AbortController
- `useCallback` — stabilize the outside-click handler attached to the document

---

## Constraints

- No external debounce libraries (e.g., lodash.debounce). Implement debounce manually using `setTimeout`/`clearTimeout`.
- No external UI libraries.
- The debounce delay must be configurable via a prop (default 400ms).
- Use `AbortController` to cancel in-flight fetch requests when the user types again before the previous request completes.

---

## Performance Notes

| Risk | Solution |
|---|---|
| Outside-click handler re-created on every render | `useCallback` with stable deps |
| Fetch fires on every keystroke | Manual debounce with `clearTimeout` |
| Stale response from a previous query overwrites current results | `AbortController` cancels old requests |
| Results list re-renders every time unrelated state changes | `React.memo` on the result item component |

**Interview talking point:** "The key performance concern here is two-fold: we debounce the API call to avoid N requests for an N-character string, and we use AbortController so only the response matching the latest query is ever applied to state."

---

## Edge Cases to Consider

- User types quickly and then stops — only the last query should fire.
- User clears input mid-flight — the in-flight request must be cancelled.
- API returns an error — show an inline error message, not a crash.
- Two rapid identical queries — should not fire twice.
- Component unmounts while a fetch is in-flight — must clean up to avoid setState-on-unmounted-component.
- Empty string query — should not trigger a fetch.
- Results contain special characters — must render safely without XSS risk.
