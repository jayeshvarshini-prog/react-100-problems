# 62 — Undo / Redo System for a Form Editor

## Problem Statement

You are building an undo/redo system for a visual form builder. Users can add fields, remove fields, reorder fields, and change field properties. Every mutation must be undoable and redoable via Ctrl+Z / Ctrl+Y keyboard shortcuts and toolbar buttons. The undo stack is limited to 50 operations. Individual field edits while typing are coalesced (multiple sequential changes to the same field within 500ms are treated as one undo step).

---

## Expected Behavior

- Every change to the form state creates a new entry in the undo stack.
- Ctrl+Z undoes the most recent change. The undo toolbar button is disabled when the stack is empty.
- Ctrl+Y (or Ctrl+Shift+Z) redoes the most recently undone change. The redo button is disabled when the redo stack is empty.
- Performing a new action after undoing clears the redo stack.
- Text changes to a field's label within a 500ms window are coalesced into a single undo step.
- The undo stack is capped at 50. When exceeded, the oldest entry is dropped.
- A tooltip on the Undo button shows what will be undone ("Undo: Add Text Field").

---

## Required React Concepts

- `useReducer` — manage history state: `{ past: State[], present: State, future: State[] }` with UNDO, REDO, and all form mutation actions
- `useEffect` — attach Ctrl+Z and Ctrl+Y keyboard listeners on mount
- `useRef` — coalescing timer for text field edits; store the "last action label" for the tooltip
- `useMemo` — derive `canUndo`, `canRedo`, `undoLabel`, `redoLabel` from history state
- `useCallback` — memoize undo, redo, and all form mutation dispatchers
- Custom hook (`useUndoable`) — wrap any reducer with undo/redo capability; return augmented dispatch and history state

---

## Constraints

- The `useUndoable` hook must be generic — it wraps any reducer, not just the form reducer.
- Stack cap enforcement (50 items) must drop the oldest `past` item when exceeded.
- Coalescing must be implemented via `useRef`-based timer, not `useState`.
- Redo stack must be cleared on any non-undo/redo action.

---

## Edge Cases to Consider

- User presses Ctrl+Z with nothing to undo — no state change, no error.
- Undo applied when `past` has 1 item — moves to empty undo stack; undo button disabled after.
- Coalescing: user types in field A, then field B — the coalesce timer must not merge changes to different fields.
- Undo called while a coalescing timer is pending — must flush the pending coalesced change before undoing.
- 50-item stack: adding the 51st item drops item 1 from `past` correctly.
- Page reload — undo history is intentionally not persisted (session-only).
