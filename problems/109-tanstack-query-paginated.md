# 109 — TanStack Query — Paginated Queries

## Problem Statement

Build a paginated post list using TanStack Query. Each page fetches a fixed number of items. When the user navigates to a new page, the old content must remain visible (no blank flash) until the new page resolves — achieved with `placeholderData: keepPreviousData`. Show the current page number, total pages, Previous / Next / numbered page buttons. Pre-fetch the next page in the background so navigation feels instant.

---

## Expected Behavior

- 8 items per page from a mock dataset of 47 items (so 6 pages total).
- Previous / Next buttons and numbered page buttons.
- While the new page loads, existing content dims to 50% opacity — no full blank/loading screen.
- "Loading…" is only shown on the very first load (no cached data yet).
- `queryKey` includes the page number: `['posts', page]` — each page is cached independently.
- Hovering "Next" pre-fetches the next page into the cache (bonus).

---

## Where to Start — Interview Approach

### Step 1: State shape
```
{ page: 1 }
```
Only `page` is stateful. Items, total, totalPages — all derived from the query.

### Step 2: useQuery with page in the key
```js
const { data, isLoading, isPlaceholderData } = useQuery({
  queryKey: ['posts', page],
  queryFn:  () => fetchPage(page),
  placeholderData: keepPreviousData,  // import from @tanstack/react-query
});
```
`keepPreviousData` keeps the last successful `data` visible while the new page loads. `isPlaceholderData` is `true` during that window — use it to dim the list.

### Step 3: Mock paginated fetch
```js
const fetchPage = (page) =>
  new Promise((resolve) =>
    setTimeout(() => {
      const start = (page - 1) * PAGE_SIZE;
      resolve({
        items:      ALL_ITEMS.slice(start, start + PAGE_SIZE),
        total:      ALL_ITEMS.length,
        totalPages: Math.ceil(ALL_ITEMS.length / PAGE_SIZE),
        page,
      });
    }, 500)
  );
```

### Step 4: Dimming during transition
```jsx
<div style={{ opacity: isPlaceholderData ? 0.5 : 1, transition: 'opacity 0.2s' }}>
  {data?.items.map(...)}
</div>
```

### Step 5: Pre-fetching (bonus)
```js
const queryClient = useQueryClient();
const prefetchNext = () => {
  if (page < totalPages) {
    queryClient.prefetchQuery({
      queryKey: ['posts', page + 1],
      queryFn:  () => fetchPage(page + 1),
    });
  }
};
// <button onMouseEnter={prefetchNext}>Next</button>
```

---

## Required TanStack Query APIs

- `useQuery` with `queryKey: ['posts', page]` — page in the key is what causes cache miss on page change
- `placeholderData: keepPreviousData` — keeps stale data visible during loading
- `isPlaceholderData` — flag to show transition state in UI
- `queryClient.prefetchQuery` — populate cache before user navigates

---

## Constraints

- `queryKey` must include `page` so each page is cached separately.
- `placeholderData: keepPreviousData` must be used — do NOT reset items to `[]` on page change.
- Previous button must be disabled on page 1. Next button disabled on the last page.
- Page count must be derived from the API response, not hardcoded.

---

## Edge Cases to Consider

- Last page has fewer items than `PAGE_SIZE` — `totalPages` must be `Math.ceil`, not `Math.floor`.
- Navigating back to a previously visited page — cache hit; instant render, no loading state.
- `keepPreviousData` shows page 2 content while page 3 loads — the page number in the heading must still show "Page 3" (derive from `page` state, not `data.page`).
- User clicks "Next" very rapidly — queries are deduplicated; only one network request per unique key.
- Empty dataset — `totalPages` would be 0; Previous and Next must both be disabled.
