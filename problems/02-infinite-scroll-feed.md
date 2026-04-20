# 02 — Infinite Scroll Product Feed

## Problem Statement

You are building the product listing page for an e-commerce platform. Products are loaded in pages of 20 from a paginated API. As the user scrolls to the bottom of the list, the next page of products is automatically fetched and appended. A loading skeleton must appear at the bottom while the next page loads. Once all products have been fetched, a "You've reached the end" message replaces the loader. Users can also apply a category filter from a sidebar; changing the filter resets the list back to page 1.

---

## Expected Behavior

- On mount, page 1 of products is fetched and displayed.
- As the user scrolls near the bottom (within 200px), the next page is fetched.
- New products are appended to the existing list, not replacing it.
- A skeleton loader (3 placeholder cards) appears at the bottom while loading.
- When `hasMore` is false from the API, the skeleton is replaced by an end message.
- Selecting a category filter clears all loaded products and restarts from page 1.
- If a fetch fails, an inline retry button appears at the bottom.

---

## Required React Concepts

- `useState` — products array, current page, hasMore flag, loading state, error state, active filter
- `useEffect` — trigger fetch when page or filter changes
- `useRef` — attach an Intersection Observer to the sentinel element at the bottom of the list
- `useCallback` — memoize the Intersection Observer callback
- `useMemo` — derive filtered/sorted product list if client-side operations apply

---

## Constraints

- Use `IntersectionObserver` for scroll detection. Do not use scroll event listeners.
- No external infinite scroll libraries.
- The observer must be disconnected and reconnected correctly when the page resets.
- Prevent duplicate fetches (do not fetch page N twice simultaneously).

---

## Edge Cases to Consider

- User scrolls very fast — multiple intersection triggers before the first fetch resolves.
- Filter changes while a fetch is in-flight — the in-flight response must be ignored.
- API returns fewer items than page size on the last page — must correctly set `hasMore = false`.
- Network failure mid-scroll — graceful error state with retry.
- Component unmounts mid-fetch — must abort and not call setState.
- Empty results on page 1 (no products in category) — show empty state, not loader.
- Window resize causing re-trigger of intersection — should not cause duplicate loads.
