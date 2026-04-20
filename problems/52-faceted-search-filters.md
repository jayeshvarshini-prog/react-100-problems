# 52 — Faceted Search with Dynamic Filter Counts

## Problem Statement

You are building the search and filter experience for a marketplace listing page. Users enter a search query and refine results using faceted filters: Category, Price Range, Rating, Brand, and Availability. Each filter facet shows the number of matching results for each option (these counts change dynamically as other filters are applied). Filters are represented as URL query params. Selecting multiple values within one facet is OR logic; between facets is AND logic.

---

## Expected Behavior

- A search input sends a query to the API along with active filters (debounced 400ms).
- The left panel shows filter facets. Each option within a facet shows a result count in parentheses.
- Selecting a filter option adds it to the active filters and re-fetches results.
- Multiple options in the same facet are OR'd together; different facets are AND'd.
- Active filters appear as dismissible chips at the top of the results.
- Price range facet has a min/max dual-handle slider.
- A "Clear All" button removes all active filters.
- All filter state is in the URL so the search page is bookmarkable.

---

## Required React Concepts

- `useState` — loading state, results, facet data
- `useEffect` — fetch results and facet counts when URL params change
- `useMemo` — build the active filters object from URL params; derive the filter chips array
- `useCallback` — memoize filter toggle, clear, and price range change handlers
- `useRef` — debounce timer for search input; dual slider thumb drag state
- Custom hook (`useFacetedSearch`) — manage URL param sync, debounced fetching, and results/facets state

---

## Constraints

- URL query params are the single source of truth for all filter state.
- Facet counts from the API represent counts for that value given all OTHER active filters (not total counts).
- No external search or facet libraries.
- Price range slider must be built from scratch (no range slider library).
- Clearing one filter from a facet must not clear other facets.

---

## Edge Cases to Consider

- Facet option count drops to 0 while it is actively selected — show it with "0" count but keep it selected.
- Price min > price max from URL params (user typed invalid URL) — swap or reject gracefully.
- Search returns 0 results — all facet counts drop to 0; show "No results" empty state.
- Filter selected while a fetch is already in-flight — cancel the in-flight request, start a new one.
- URL shared to another user who lacks access to some filtered categories — API handles access; UI shows available results.
- Rapid facet toggling — debounce or serialize to avoid race conditions in the result set.
