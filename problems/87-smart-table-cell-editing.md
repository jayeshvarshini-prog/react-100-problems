# 87 — Smart Table with Inline Cell Editing

## Problem Statement

You are building an inline-editable data table for an inventory management SaaS. Each cell in the table can be double-clicked to enter edit mode. Text fields, number fields, select dropdowns, and date fields must all be supported. Edited cells are highlighted. Changes are committed on Enter or blur and saved to the API. If the API call fails, the cell reverts to its original value. Multiple cells can be in edit mode simultaneously.

---

## Expected Behavior

- Double-clicking a cell switches it to edit mode with the appropriate input type (text, number, select, date).
- The input is auto-focused when edit mode activates.
- Pressing Enter or blurring the input commits the change. The cell shows a loading state while saving.
- On success, the new value is displayed. On failure, the cell reverts and shows a tooltip error.
- Pressing Escape cancels the edit and reverts to the original value without an API call.
- Multiple cells can be in edit mode simultaneously (each saves independently).
- Edited but unsaved cells show a yellow highlight.

---

## Required React Concepts

- `useState` — editing cells map `{ [cellId]: { value, originalValue, status: 'editing'|'saving'|'error' } }`
- `useCallback` — memoize double-click handler, commit handler, cancel handler, change handler per cell
- `useMemo` — derive which cells are "dirty" (changed from original); derive whether any saves are in-flight
- `useRef` — per-cell input refs for auto-focus; per-cell original value snapshot
- Custom hook (`useCellEditor`) — accept cell ID, current value, save function; return `{ isEditing, editValue, startEdit, commit, cancel, handleChange }`

---

## Constraints

- Each cell's edit state must be independent — editing cell A and cell B simultaneously must work.
- The commit handler must capture the cell's original value at the moment editing started, not the row's current state.
- Select dropdowns must close on outside click or Escape.
- Auto-focus must use `useEffect` within the cell — not called directly in the event handler.

---

## Edge Cases to Consider

- Two users edit the same cell simultaneously — on save, server may return a conflict (409); show "Someone else changed this value."
- User double-clicks a cell that is already in edit mode — must not reset the edit.
- Select cell: user opens the dropdown, then clicks Escape — must cancel the edit and close the dropdown.
- Number cell: user types a non-numeric value — prevent it; show inline validation.
- Cell value is very long text — edit mode input must be full-width and multi-line.
- Row is deleted server-side while a cell edit is in-flight — handle 404 on save gracefully.
