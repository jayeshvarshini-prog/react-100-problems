# 115 — Infinite Scroll Feed

## Problem Statement

Build a news/article feed that loads content in pages of 10 as the user scrolls. Use `IntersectionObserver` to detect when the last card enters the viewport and trigger the next page fetch. Append new cards to the existing list — do not replace them. Add a category filter toolbar at the top; changing the filter resets the feed back to page 1. Show a loading indicator at the bottom while fetching, and "All posts loaded" when the feed is exhausted. Implement everything with plain React hooks — no TanStack Query.

---

## Expected Behavior

- Page 1 loads on mount.
- Scrolling to the last card triggers the next page fetch automatically.
- New cards are appended below existing ones.
- 5 category filter buttons (All, Tech, Science, Design, Business, Health). "All" shows everything.
- Switching category: resets posts to `[]`, page to 1, hasMore to true — then fetches page 1 of the new filter.
- Loading indicator at bottom while `loading` is true.
- "All posts loaded" when `hasMore` is false.
- 80 total mock articles, 10 per page.

---

## Where to Start — Interview Approach

### Step 1: State shape
```
{
  posts:   [],       // accumulated across pages
  page:    1,
  loading: false,
  hasMore: true,
  filter:  'All',
}
```

### Step 2: Fetch effect — depend on page AND filter
```js
useEffect(() => {
  if (!hasMore) return;
  setLoading(true);
  fetchFeed(page, filter).then((data) => {
    setPosts((prev) => [...prev, ...data]);
    setHasMore(data.length === PAGE_SIZE);
    setLoading(false);
  });
}, [page, filter]);
```

### Step 3: Filter change resets everything
```js
const handleFilter = (category) => {
  setFilter(category);
  setPosts([]);
  setPage(1);
  setHasMore(true);
};
```
Because setting `page` back to 1 and `filter` to a new value changes the `useEffect` deps, the effect re-runs automatically with a clean slate.

### Step 4: IntersectionObserver on the last card
```js
const observer = useRef();
const lastRef = useCallback((node) => {
  if (loading) return;
  if (observer.current) observer.current.disconnect();
  observer.current = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore) {
      setPage((p) => p + 1);
    }
  });
  if (node) observer.current.observe(node);
}, [loading, hasMore]);

// In JSX — only the last item gets the ref
posts.map((post, i) => (
  <div key={post.id} ref={i === posts.length - 1 ? lastRef : null}>
    ...
  </div>
))
```

### Step 5: Filter client-side vs server-side
Option A (simpler): fetch all posts and filter on the client.
Option B (realistic): pass the filter to the mock `fetchFeed` function and return only matching posts. Use Option B — it better reflects a real paginated API.

---

## Required React Concepts

- `useState` — posts, page, loading, hasMore, filter
- `useEffect` — fetch when page or filter changes
- `useRef` — hold the IntersectionObserver instance
- `useCallback` — memoize the `lastRef` callback so the observer isn't disconnected on every render
- `IntersectionObserver` — do NOT use scroll event listeners

---

## Constraints

- No TanStack Query, no SWR, no external data-fetching library.
- Use `IntersectionObserver`, not `window.addEventListener('scroll', ...)`.
- Changing the filter must reset `posts` to `[]` and `page` to 1 before fetching.
- Do not fetch the next page if `loading` is already true (debounce guard).
- `hasMore` must be derived from whether the last fetch returned a full page.

---

## Performance Notes

| Risk | Solution |
|---|---|
| Re-creating IntersectionObserver on every render | `useCallback` with `[loading, hasMore]` deps |
| Duplicate fetch on filter change | Effect guard: `if (!hasMore) return` + loading flag |
| Growing DOM for very long feeds | Out of scope here; in production use virtualization (react-virtual) |

---

## Edge Cases to Consider

- User scrolls to bottom before page 1 resolves — `loading` is true, so `lastRef` returns early and the observer is not set up. No duplicate fetch.
- Filter change while a fetch is in-flight — the in-flight response resolves and appends to the now-reset posts list. Fix with an `isCurrent` flag or AbortController inside the effect.
- Last page returns exactly PAGE_SIZE items — `hasMore` would be set to true, causing one extra fetch that returns 0 items. Handle: also set `hasMore = false` if the returned data is empty.
- All posts fit on page 1 — `hasMore` is false immediately; observer is never needed.
- Category with 0 matching posts — empty state message instead of the loading indicator.
