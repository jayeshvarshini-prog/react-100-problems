# 10 — Drag and Drop Kanban Board

## Problem Statement

You are building a project management Kanban board for a task tracking SaaS. The board has multiple columns (e.g., Todo, In Progress, Review, Done). Each column contains task cards. Users can drag and drop cards between columns and reorder cards within a column. After a drop, the new order is persisted to the API. If the API call fails, the board must visually revert to the pre-drag state. A card count badge on each column header updates in real time.

---

## Expected Behavior

- Cards can be dragged from any column and dropped onto any other column or reordered within the same column.
- While dragging, a ghost of the card follows the cursor. The drop target column is highlighted.
- On a successful drop, the card appears in its new position immediately (optimistic update).
- An API call is made to persist the new order. If it fails, the board reverts with a toast notification.
- Column card-count badges update in real time as cards are moved.
- Cards display title, assignee avatar, priority badge, and due date.
- Columns are horizontally scrollable if there are many columns.

---

## Required React Concepts

- `useReducer` — manage board state (columns map, card positions) with MOVE_CARD and REVERT actions
- `useState` — dragging state (which card, source column), drop target highlight state
- `useRef` — store the pre-drag board snapshot for revert; drag handles for DOM manipulation
- `useCallback` — memoize drag event handlers (onDragStart, onDragOver, onDrop, onDragEnd)
- `useMemo` — derive per-column card arrays from the board state map
- Custom hook (`useBoardDrag`) — encapsulate all drag-and-drop event logic

---

## Constraints

- Use the native HTML5 Drag and Drop API. No external DnD libraries.
- Board state must be normalized: a map of `columnId -> cardIds[]` and a separate `cards` map.
- Optimistic update must happen before the API call returns.
- Revert logic must restore the exact pre-drag state.

---

## Edge Cases to Consider

- User drops a card onto its original position — no API call should be made.
- User starts dragging and then presses Escape — must cancel the drag and restore state.
- API call is in-flight and user starts another drag — must handle queued mutations correctly.
- Column has 0 cards — the drop zone must still be a valid drop target.
- Card dragged to the very beginning or very end of a column.
- Multiple users editing the board (simulate stale data) — server returns a conflict response.
- Touch devices — the HTML5 DnD API does not work on mobile; document this limitation clearly.
