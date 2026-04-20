# 82 — Drag-and-Drop Email Template Block Builder

## Problem Statement

You are building a drag-and-drop email template builder for a marketing SaaS. The builder has a left panel with block types (Header, Text, Image, Button, Divider, Footer). Users drag blocks into a canvas in the center. Blocks can be reordered by drag. Clicking a block opens an editing panel on the right where its properties (text, color, alignment, URL) can be configured. The resulting template is serialized to a JSON schema.

---

## Expected Behavior

- The left panel shows 6 draggable block type tiles.
- Dragging a block type onto the canvas inserts a new instance of that block at the drop position.
- Blocks on the canvas can be reordered by dragging (drag handle on the left of each block).
- Clicking a block selects it. The right panel shows its editable properties.
- Changes in the right panel update the selected block's content in real time.
- A trash icon on each block removes it.
- An "Export JSON" button serializes the current block list to a JSON schema.
- An "Import JSON" button accepts a JSON schema and rebuilds the canvas.

---

## Required React Concepts

- `useReducer` — manage canvas blocks: `[{ id, type, props }]` with INSERT_BLOCK, MOVE_BLOCK, UPDATE_BLOCK, DELETE_BLOCK, LOAD_BLOCKS actions
- `useState` — selected block ID
- `useCallback` — memoize drag start (from palette), drag over, drop, delete, and property change handlers
- `useMemo` — derive the JSON export string from the blocks array; derive whether the canvas is empty
- `useRef` — drag data (type for palette drag; index for reorder drag); canvas container ref
- Custom hook (`useBlockCanvas`) — encapsulate all block management and drag logic

---

## Constraints

- Two distinct DnD operations: (1) palette → canvas (insert), (2) canvas → canvas (reorder).
- Both use the HTML5 DnD API with `dataTransfer.setData` to distinguish operation types.
- The selected block's property edits must update the block without re-rendering unrelated blocks (memoize block items with `React.memo`).
- No external DnD or template builder libraries.

---

## Edge Cases to Consider

- User drags a block to the very top or very bottom of the canvas — insert before first / after last correctly.
- Canvas has 0 blocks — show a "Drag a block here to start" empty state drop zone.
- Importing invalid JSON — show an error; do not crash the canvas.
- Deleting the selected block — clear the selection and show an empty right panel.
- Same block type added 5 times — each must have a unique ID.
- "Export JSON" then "Import JSON" — round-trip must produce an identical canvas.
