# Starter Template — Apply This to Every Problem

> Before writing any code for any problem, fill in this template. It takes 3 minutes and prevents blank-screen panic.

---

## Template to Fill Out

```
PROBLEM: _______________

## 1. State Shape
What data changes over time?

{
  // data
  ___: [],

  // async status
  loading: false,
  error: null,

  // UI state
  ___: false,
}

Use useState? useReducer?
→ More than 3 related values that change together → useReducer
→ Otherwise → useState

## 2. Effects Needed
List every useEffect:

- Effect 1: When [dep] changes → [action]
- Effect 2: On mount → [subscribe to X], on unmount → [unsubscribe]

## 3. Derived Values (useMemo)
What can be COMPUTED instead of stored?

- filteredItems = useMemo(() => items.filter(...), [items, query])
- total = useMemo(() => items.reduce(...), [items])

## 4. Refs Needed (useRef)
What do I need to hold that SHOULD NOT trigger a re-render?

- Timer IDs
- AbortController
- DOM element references
- Previous state snapshots (for optimistic revert)

## 5. Performance Risks
- [ ] Large list? → virtualize
- [ ] Input driving API? → debounce
- [ ] Functions passed to children? → useCallback + React.memo
- [ ] Expensive computation? → useMemo
- [ ] Multiple components need same data? → deduplicate fetch

## 6. Custom Hook Opportunity
Can I extract the core logic into a reusable hook?
Name it: use___
It accepts: ___
It returns: ___
```

---

## Filled Example — Problem 01: Live Search

```
PROBLEM: Live search input with debounced API + dropdown

## 1. State Shape
{
  query: '',         // controlled input
  results: [],       // fetched matches
  loading: false,    // spinner
  open: false,       // dropdown visible
  error: null,       // fetch error
}
→ 5 independent values → useState (5 separate calls)

## 2. Effects Needed
- Effect 1: When [query] changes → set 400ms timer → on fire: call API
  cleanup: clearTimeout (cancel pending timer)
- Effect 2: On mount → add mousedown listener to document for outside-click
  cleanup: removeEventListener

## 3. Derived Values
- None needed (results come from API, not derived from other state)

## 4. Refs Needed
- timerRef     → setTimeout ID (don't re-render when timer changes)
- controllerRef → AbortController (cancel in-flight fetch)
- containerRef  → dropdown DOM node (outside-click detection)

## 5. Performance Risks
- [x] Input driving API → debounce 400ms
- [x] Stale responses → AbortController
- [ ] Result list items → wrap in React.memo if results are complex

## 6. Custom Hook
Name: useSearch(fetchFn, delay)
Accepts: async fetchFn, debounce delay
Returns: { query, setQuery, results, loading, error, open, close }
```

---

## Filled Example — Problem 04: Data Table with Sort/Filter/Pagination

```
PROBLEM: Table with client-side sort, filter, pagination, URL sync

## 1. State Shape
{
  data: [],           // full dataset from API (loaded once)
  sortColumn: 'id',
  sortDirection: 'asc',
  filters: { status: 'all', dateFrom: null, dateTo: null },
  page: 1,
  pageSize: 25,
}
→ Many related values → useReducer

## 2. Effects Needed
- Effect 1: On mount → fetch full dataset; hydrate state from URL params
- Effect 2: When any state changes → write to URL with history.replaceState

## 3. Derived Values (useMemo — chain order matters!)
- filteredRows = useMemo(applyFilters, [data, filters])
- sortedRows   = useMemo(applySort,    [filteredRows, sortColumn, sortDirection])
- paginatedRows = useMemo(applyPage,   [sortedRows, page, pageSize])
- totalCount   = filteredRows.length

## 4. Refs Needed
- None for this problem (URL is synced in useEffect, not a ref)

## 5. Performance Risks
- [x] Filtering/sorting 10,000 rows → useMemo chain
- [x] Column header click handlers → useCallback
- [x] Table rows re-rendering on sort change → React.memo on row component
- [x] URL sync on every state change → useEffect with replaceState (not pushState)

## 6. Custom Hook
Name: useTableState(initialFilters)
Returns: { paginatedRows, totalCount, sortColumn, sortDirection, filters, page,
           handleSort, handleFilter, handlePageChange, handlePageSizeChange }
```

---

## Quick Reference: When to Use Each Hook

```
STORING VALUE      → useState (if re-render needed) | useRef (if not)
REACTING TO CHANGE → useEffect
COMPUTING VALUE    → useMemo
STABLE FUNCTION    → useCallback
SHARING VALUE      → useContext
COMPLEX ACTIONS    → useReducer
REUSABLE LOGIC     → custom hook
```

---

## The One-Sentence Rule for Each Hook

- `useState` — "I need this value to be remembered AND to cause a re-render when it changes."
- `useRef` — "I need this value to be remembered but NOT cause a re-render."
- `useEffect` — "I need to do something AFTER a render (fetch, subscribe, sync)."
- `useMemo` — "I need to compute this value efficiently and only when its inputs change."
- `useCallback` — "I need this function to have a stable reference across renders."
- `useReducer` — "I have multiple pieces of state that change together in response to named actions."
- `useContext` — "I need to share this value without passing it as props through every component."
