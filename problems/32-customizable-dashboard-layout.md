# 32 — Customizable Dashboard Layout (Drag-to-Arrange Widgets)

## Problem Statement

You are building a customizable dashboard for a SaaS analytics product. Users can add, remove, resize, and rearrange widgets on a grid. The layout is persisted per-user to the API. Widgets include: Revenue Chart, User Stats, Recent Activity, Conversion Funnel, and Top Channels. A "Customize" mode toggles drag handles and resize handles on each widget. Layout changes are saved automatically when the user exits Customize mode.

---

## Expected Behavior

- On mount, the saved layout is fetched from the API and widgets are rendered at their saved positions/sizes.
- Clicking "Customize Layout" enters edit mode: widgets show drag handles (move) and resize handles (corner drag).
- In edit mode, dragging a widget to a new grid position moves it; other widgets reflow to avoid overlap.
- Resizing a widget snaps to grid columns.
- An "Add Widget" button in edit mode opens a panel showing available widgets not yet on the dashboard.
- Clicking "Done" exits edit mode and saves the new layout to the API.
- If saving fails, the layout reverts to the last saved version and a toast appears.

---

## Required React Concepts

- `useReducer` — manage layout state: `{ widgets: [{ id, x, y, w, h }] }` with MOVE, RESIZE, ADD, REMOVE, RESET actions
- `useState` — customize mode toggle
- `useEffect` — fetch saved layout on mount
- `useRef` — store the last-saved layout snapshot for revert; drag start coordinates
- `useCallback` — memoize drag and resize event handlers
- `useMemo` — derive the grid occupancy map from widget positions for collision detection
- Custom hook (`useGridDrag`) — encapsulate drag logic for a widget, returning position and event handlers

---

## Constraints

- Grid must be CSS Grid-based, not an absolute-position free-for-all.
- Widget positions must be stored as grid column/row coordinates, not pixel coordinates.
- No external drag-and-drop or grid layout libraries.
- Layout save must only fire when exiting Customize mode, not on every drag/resize.

---

## Edge Cases to Consider

- Widget dragged to overlap another — must displace, not overlap.
- All widgets removed — dashboard shows an empty state with the "Add Widget" prompt.
- Layout API fetch fails on mount — show default layout, not a broken empty grid.
- Screen resized during edit mode — grid reflow must not break widget positions.
- Two widgets swapped positions simultaneously (unlikely but consider atomicity).
- Widget minimum size constraint — some widgets cannot be resized below 2×2.
