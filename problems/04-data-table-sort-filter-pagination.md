# 04 — Data Table with Sort, Filter, and Pagination

## Problem Statement

You are building an orders management table for an e-commerce admin panel. The table displays a list of orders fetched from an API. Users can sort any column by clicking the column header (toggle ascending/descending). Users can filter by order status using a dropdown and by date range using two date inputs. The table supports client-side pagination with a configurable page size selector (10, 25, 50 rows). All filter, sort, and page state must be reflected in the URL query string so that the view can be shared via link.

---

## Expected Behavior

- On mount, table fetches data and reads initial sort/filter/page state from the URL.
- Clicking a column header sorts the table by that column; clicking again reverses direction. A sort icon reflects current direction.
- The status dropdown and date range inputs filter the displayed rows immediately (client-side filtering after initial full fetch).
- Page controls (Prev / Next / page numbers) navigate through results.
- Changing page size resets to page 1.
- All state changes update the URL query string without triggering a full page reload.
- The total row count and current range ("Showing 11–20 of 87") are displayed above the table.

---

## Required React Concepts

- `useState` — sort column, sort direction, active filters, current page, page size
- `useEffect` — sync state to/from URL on mount and on state change
- `useMemo` — derive filtered rows, then sorted rows, then paginated slice from the master data array
- `useCallback` — memoize column header click handlers to prevent unnecessary re-renders of table headers
- `useRef` — store the full unfiltered dataset to avoid re-fetching on filter/sort changes

---

## Constraints

- All filtering and sorting must be client-side after the initial data load.
- URL sync must use `history.replaceState` or a router's replace method — do not push a new history entry on every state change.
- No external table libraries (no react-table, AG Grid, etc.).
- Sorting must handle string, number, and ISO date string column types correctly.

---

## Edge Cases to Consider

- Sorting a column that has `null` or `undefined` values — nulls should sort to the bottom.
- Applying a date filter that returns 0 rows — show empty state row spanning all columns.
- User manually edits URL query params to an invalid value — fall back to defaults gracefully.
- Rapidly clicking sort headers — should not produce flickering or stale state.
- Page size change when on page 5 — if new page count is less than 5, jump to last valid page.
- Combination of status filter AND date filter — both must apply simultaneously (AND logic).
- Very long strings in cells — must truncate with ellipsis, not break layout.
