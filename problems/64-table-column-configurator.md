# 64 — Table Column Configurator (Show/Hide and Reorder)

## Problem Statement

You are building a column configurator for a large data table in an operations dashboard. Users can show/hide columns and reorder them by drag-and-drop. The column configuration is persisted per-user to the API. A "Columns" button opens a panel showing all available columns as toggleable, draggable items. Changes are applied live (table updates as columns are toggled/reordered) and saved when the panel is closed.

---

## Expected Behavior

- Clicking "Columns" opens a side panel listing all available columns with checkboxes.
- Unchecking a column hides it in the table immediately (live preview).
- Columns in the panel can be reordered by dragging. The table column order updates in real time.
- At least 1 column must remain visible — the last visible column's checkbox is disabled.
- A "Reset to default" button reverts to the default column set and order.
- When the panel is closed, the current configuration is saved to the API.
- If the save fails, a toast appears: "Failed to save column preferences."

---

## Required React Concepts

- `useState` — panel open/closed, column config `[{ id, label, visible, order }]`
- `useEffect` — fetch saved column config on mount; save when panel closes
- `useRef` — drag source column ref; snapshot of last saved config for revert on save failure
- `useMemo` — derive the sorted, visible columns for the table; derive whether at least 1 visible column exists
- `useCallback` — memoize visibility toggle handler and drag event handlers
- Custom hook (`useColumnConfig`) — manage column state, persistence, drag reorder, and reset logic

---

## Constraints

- Column config is stored as an ordered array with visibility flags — not as a Set of visible IDs.
- Drag reorder must use HTML5 DnD API (no library).
- The table re-renders with the new column order on every drag (live preview, not just on drop).
- Save must fire on panel close, not on every toggle/drag.

---

## Edge Cases to Consider

- All columns unchecked except 1 — that column's checkbox is disabled and cannot be unchecked.
- Saved config from the API has columns that no longer exist in the codebase (deprecated column) — skip those gracefully.
- Saved config is missing a new column added to the codebase — add the new column to the end with `visible: true`.
- Drag initiated but mouse released outside the panel — drag state must clean up; no ghost elements left.
- User closes the panel while a save is already in-flight — do not trigger a second save.
- Reset to default — if default config differs from API-saved config, the user sees the diff and can re-save.
