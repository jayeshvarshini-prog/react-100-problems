# 63 — Context Menu (Right-Click Menu)

## Problem Statement

You are building a context menu system for a file management SaaS. Right-clicking on any file or folder in the file tree opens a context menu with relevant actions (Open, Rename, Move, Copy Link, Download, Delete). The menu items depend on the type of the clicked item (file vs. folder) and user permissions. The menu must position itself within the viewport, closing on any click outside or on Escape.

---

## Expected Behavior

- Right-clicking a file or folder triggers a context menu positioned at the cursor.
- Menu items are derived from the item type and user permissions (e.g., Delete is hidden for viewers).
- The menu positions itself to the right and below the cursor by default.
- If the menu would overflow the right edge, it repositions to the left of the cursor. Same for bottom edge.
- Clicking a menu item executes its action and closes the menu.
- Clicking anywhere else or pressing Escape closes the menu.
- Hovering over items with sub-menus (e.g., "Move to…") opens a nested sub-menu.

---

## Required React Concepts

- `useState` — open state, menu position `{ x, y }`, context item (the right-clicked file/folder), hovered item for sub-menu
- `useEffect` — attach global click listener and Escape key listener for closing; clean up on unmount
- `useRef` — reference to the menu container for boundary detection and outside-click guard
- `useMemo` — derive the menu item list from the context item type and user permissions
- `useCallback` — memoize right-click handler, item click handler, Escape handler
- Custom hook (`useContextMenu`) — return `{ menuProps, triggerProps, close }` for decoupled usage

---

## Constraints

- Menu must render via a React Portal (to avoid z-index issues).
- Viewport boundary detection must run after the menu renders (use `useLayoutEffect` or post-render measurement).
- No external context menu libraries.
- Menu items must support keyboard navigation (Arrow Up/Down, Enter to select, Escape to close).

---

## Edge Cases to Consider

- Right-click very close to the bottom-right corner — menu must fit inside the viewport.
- Sub-menu opens near the right edge — sub-menu must appear to the left.
- Context item changes permission (e.g., another user changes sharing settings mid-session) — menu items must reflect current permissions on next open.
- Right-clicking rapidly on different items — only the most recent context menu should be open.
- Context menu open and window is scrolled — menu must remain at its original position (fixed, not absolute).
- Menu item triggers an async operation (e.g., Delete opens a confirm modal) — menu must close before the modal opens.
