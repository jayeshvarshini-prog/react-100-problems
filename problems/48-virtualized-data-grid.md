# 48 — Virtualized Data Grid with Frozen Columns

## Problem Statement

You are building a high-performance data grid for a financial platform that displays up to 50,000 rows and 30+ columns. Both rows and columns are virtualized. The first 2 columns (ID and Name) are frozen and always visible while the user scrolls horizontally. Column headers are sortable. Cells are selectable (click to select, shift-click for range, Ctrl+click for multi-select). Selected cells can be copied to clipboard in TSV format.

---

## Expected Behavior

- The grid renders only the visible rows and columns (plus overscan of 3 in each direction).
- The first two columns are sticky (frozen) and do not scroll with horizontal scroll.
- Column headers show sort icons; clicking a header sorts the data by that column.
- Clicking a cell selects it (highlighted). Shift-clicking extends the selection rectangle. Ctrl+clicking toggles individual cells.
- Pressing Ctrl+C copies the selected cell range as TSV to the clipboard.
- Scrolling (vertical or horizontal) updates the rendered cells within a single animation frame.
- A row height of 36px and column width (configurable per column) are used for virtualization math.

---

## Required React Concepts

- `useState` — scroll position (scrollTop, scrollLeft), sort column/direction, selected cell range
- `useEffect` — attach scroll listener; keyboard listener for Ctrl+C
- `useRef` — reference to the scroll container; reference to the frozen column container (to sync vertical scroll independently)
- `useMemo` — derive visible row slice; derive visible column slice; derive sorted data; derive selected cells Set for O(1) lookup
- `useCallback` — memoize scroll handler (rAF-throttled), cell click handler, header click handler
- Custom hook (`useVirtualGrid`) — return visible row range, visible column range, and total dimensions

---

## Constraints

- Row and column virtualization must both be implemented (not just row virtualization).
- Frozen columns must be implemented with a separate scroll container for columns, syncing vertical scroll via scroll event.
- Clipboard copy must use the `navigator.clipboard` API with a fallback to `document.execCommand`.
- No external grid libraries.
- Column widths must be configurable per-column; rows must be uniform height.

---

## Edge Cases to Consider

- Sort on a column that is not in the visible range — sorted column becomes visible or the sort still applies to the invisible column.
- Selected range spans frozen and non-frozen columns — must copy all selected cells.
- Dataset changes (filtered) while a cell is selected — selection must be cleared.
- Ctrl+A should select all cells in the grid.
- Empty dataset — grid must render headers and an empty-state row.
- Clipboard API unavailable (HTTP context, not HTTPS) — show a tooltip "Copy unavailable."
