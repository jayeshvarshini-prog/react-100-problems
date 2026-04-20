# 92 — Deep Link State Manager (URL as Single Source of Truth)

## Problem Statement

You are building a complex filter and view configuration page for an analytics SaaS. The page has 8+ filter dimensions, a sort field, sort direction, page number, page size, and a view mode (table/chart). All this state must live in the URL so the page can be bookmarked and shared. State reads from the URL on mount and writes to the URL on every change (using `history.replaceState`).

---

## Expected Behavior

- On mount, all filter/sort/pagination values are read from the URL query string and hydrated into state.
- Invalid or missing URL params fall back to default values.
- Every state change updates the URL query string without a page reload.
- The URL is human-readable (e.g., `?status=active,pending&sort=createdAt&dir=desc&page=2&view=chart`).
- Array-valued filters (multi-select) are serialized as comma-separated values.
- A "Copy Link" button copies the current URL to clipboard.
- A "Reset to Defaults" button clears all URL params and resets state.

---

## Required React Concepts

- `useReducer` — manage the full page state object: `{ filters, sort, direction, page, pageSize, view }`
- `useEffect` — hydrate state from URL on mount; write state to URL on every change
- `useMemo` — serialize the state to a URL query string; deserialize URL string to state object
- `useCallback` — memoize the copy-link and reset handlers
- Custom hook (`useURLState`) — generic hook that accepts a state object and a schema, handles read/write from/to URL, and returns `[state, setState]`

---

## Constraints

- The `useURLState` hook must be generic — it must work with any shape of state given a schema.
- URL writes must use `history.replaceState` — not `pushState` (avoid polluting browser history).
- Arrays must serialize to `key=val1,val2` format; booleans to `key=true`; numbers to strings.
- The deserialization must be type-safe: numbers parsed as numbers, booleans as booleans, arrays as arrays.

---

## Edge Cases to Consider

- URL contains an unknown param key — must be ignored; must not break state hydration.
- Array param in URL has a single value — must deserialize as an array with one item, not a string.
- Number param has a non-numeric string value in URL — fall back to default.
- State update fires before URL hydration completes on mount — must not override the URL-hydrated state.
- User presses browser Back button — URL reverts to previous state; React state must also revert (respond to `popstate` event).
- Very long filter values — URL may exceed browser limits; handle gracefully.
