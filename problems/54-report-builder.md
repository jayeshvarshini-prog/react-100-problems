# 54 — Report Builder with Column Selection and Preview

## Problem Statement

You are building a self-service report builder for a SaaS analytics platform. Users select a data source (Users, Orders, Events), choose which columns to include by dragging from an "Available" list to a "Selected" list, apply filters (via the filter builder from problem #47), set a sort column, and then preview the report results in a paginated table. Reports can be saved and re-run.

---

## Expected Behavior

- Step 1: User selects a data source from a dropdown.
- Step 2: A two-column layout shows "Available Columns" on the left and "Selected Columns" on the right. Users drag columns between them or click an arrow button.
- The order of selected columns determines the display order. Columns in the Selected list are reorderable by drag.
- Step 3: Filter conditions are built using the filter builder UI.
- Step 4: Sort column and direction are configured.
- Step 5: Clicking "Preview" fetches up to 100 rows with the selected columns and filters applied.
- Clicking "Save Report" persists the configuration to the API.

---

## Required React Concepts

- `useReducer` — manage report config state: `{ dataSource, selectedColumns, filters, sortColumn, sortDirection }`
- `useState` — preview data, preview loading, current step
- `useEffect` — fetch available columns when data source changes
- `useMemo` — derive the available columns (all columns minus selected); derive the preview request payload
- `useCallback` — memoize drag handlers, column toggle, step navigation
- `useRef` — drag source column ref for native DnD
- Custom hook (`useReportBuilder`) — encapsulate config state and step navigation

---

## Constraints

- Column availability must re-derive when the data source changes; previously selected columns from the old data source must be cleared.
- Preview must include only the selected columns and active filters in the request.
- Saving must serialize the full report config (including filter tree) as JSON.
- Column drag-to-reorder in the Selected list must use the HTML5 DnD API (no library).

---

## Edge Cases to Consider

- User changes data source after selecting 5 columns — all 5 are cleared; available columns update.
- Selected columns list is empty when user clicks "Preview" — show a validation error: "Select at least one column."
- Filter references a column that is not in the selected columns list — show a warning but still allow preview.
- Preview returns 0 rows — show empty state, not an empty table.
- Save fails — do not discard the report config; allow retry.
- Column name contains spaces or special characters — must serialize/deserialize correctly.
