# 110 — TanStack Query — useInfiniteQuery

## Problem Statement

Build an infinite-scroll article feed using TanStack Query's `useInfiniteQuery`. As the user scrolls to the last visible card, the next page is automatically fetched and appended. Use an `IntersectionObserver` attached to the last card to trigger `fetchNextPage`. Show a "Loading more…" indicator while fetching and "All articles loaded" when there are no more pages.

---

## Expected Behavior

- On mount, page 1 loads automatically.
- Scrolling to the last article triggers `fetchNextPage` (via IntersectionObserver, no scroll event listeners).
- New articles are appended below the existing list — nothing is replaced.
- "Loading more…" shown while `isFetchingNextPage` is true.
- "All articles loaded" shown when `hasNextPage` is false and at least one page has loaded.
- 60 total mock articles, 10 per page (6 pages).

---

## Where to Start — Interview Approach

### Step 1: useInfiniteQuery setup
```js
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
} = useInfiniteQuery({
  queryKey:        ['articles'],
  queryFn:         ({ pageParam }) => fetchArticles(pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.nextPage, // undefined = no more pages
});
```

### Step 2: Mock queryFn
```js
const fetchArticles = (page) =>
  new Promise((resolve) =>
    setTimeout(() => {
      const items = ALL_ARTICLES.slice((page - 1) * 10, page * 10);
      resolve({ items, nextPage: items.length === 10 ? page + 1 : undefined });
    }, 600)
  );
```
Return `nextPage: undefined` on the last page — `getNextPageParam` returns `undefined`, which sets `hasNextPage = false`.

### Step 3: Flatten pages into a single array
```js
const articles = data?.pages.flatMap((p) => p.items) ?? [];
```

### Step 4: IntersectionObserver on the last card
```js
const observer = useRef();
const lastRef = useCallback((node) => {
  if (isFetchingNextPage) return;
  if (observer.current) observer.current.disconnect();
  observer.current = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
  });
  if (node) observer.current.observe(node);
}, [isFetchingNextPage, hasNextPage, fetchNextPage]);

// In JSX — attach to the last item only
articles.map((a, i) => (
  <div key={a.id} ref={i === articles.length - 1 ? lastRef : null}>
    ...
  </div>
))
```

---

## Required TanStack Query APIs / React Concepts

- `useInfiniteQuery` — manages paged data accumulation
- `initialPageParam` — the value passed to `queryFn` on the very first call
- `getNextPageParam` — receives the last page's response; returns the next page param (or `undefined` to stop)
- `fetchNextPage` — called by the IntersectionObserver to load more
- `hasNextPage` — boolean; false when `getNextPageParam` returns `undefined`
- `isFetchingNextPage` — true while the next page request is in-flight
- `data.pages` — array of page responses; flatten with `.flatMap`
- `useRef` + `useCallback` — IntersectionObserver pattern for the last-card sentinel
- `IntersectionObserver` — do NOT use scroll event listeners

---

## Constraints

- Do NOT use scroll event listeners — use `IntersectionObserver` only.
- Do NOT call `fetchNextPage` if `isFetchingNextPage` is already true.
- The `lastRef` callback must disconnect the old observer before creating a new one (avoids multiple observers on the same node).
- `getNextPageParam` must return `undefined` (not `null` or `false`) to correctly set `hasNextPage = false`.

---

## Edge Cases to Consider

- User scrolls to the bottom before page 1 finishes — `hasNextPage` is undefined at this point; the observer fires but `hasNextPage` is falsy, so no duplicate fetch.
- Rapid scroll through all content — each intersection fires `fetchNextPage`, but TanStack Query deduplicates concurrent calls for the same page.
- Last page has fewer than 10 items — `nextPage` must be `undefined`, not the next page number.
- All items fit in a single page (dataset smaller than page size) — `hasNextPage` is immediately false; "All articles loaded" appears after the first fetch.
- Component unmounts mid-fetch — TanStack Query aborts and discards the response internally; no setState on unmounted component.
