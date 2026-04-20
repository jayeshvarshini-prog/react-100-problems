# 96 — Side Panel Drawer with History Stack

## Problem Statement

You are building a side panel drawer system for a CRM SaaS. Clicking a contact name opens a contact detail panel from the right. From within that panel, clicking a deal linked to the contact opens the deal detail panel (pushing a new panel on top). The user can navigate back through the panel history. Each panel loads its own data independently. The drawer system supports any content type.

---

## Expected Behavior

- Clicking a contact name opens the contact detail panel sliding in from the right.
- Within the contact panel, clicking a linked deal opens a deal detail panel on top (the contact panel stays in the stack).
- A "← Back" button in the deal panel returns to the contact panel.
- Clicking outside the drawer or pressing Escape closes the entire drawer (all panels cleared).
- Each panel shows a loading skeleton while its data is fetching.
- The panel history is represented as a stack: `[{ type, id }, { type, id }, ...]`.
- A breadcrumb at the top of the drawer shows the panel history path.

---

## Required React Concepts

- `useReducer` — manage panel stack with PUSH_PANEL, POP_PANEL, CLEAR_PANELS actions
- `useContext` — provide `pushPanel(type, id)`, `popPanel()`, `clearPanels()` throughout the app
- `useEffect` — close on Escape key; close on outside click
- `useRef` — drawer container ref for outside-click detection
- `useMemo` — derive the current (top) panel; derive the breadcrumb items from the stack
- Custom hook (`usePanelDrawer`) — expose `pushPanel`, `popPanel`, `clearPanels`, `currentPanel`, `panelStack`

---

## Constraints

- Each panel must independently fetch its data — the drawer system does not pre-fetch.
- Pushing a duplicate panel (same type and ID) must replace the top of the stack, not add a duplicate.
- The drawer must render via a React Portal.
- Focus must be trapped inside the drawer while open; restoring focus to the trigger element on close.

---

## Edge Cases to Consider

- Panel stack reaches 10 levels — enforce a maximum depth and show a "Too many panels" state.
- Back button on the first panel (stack has 1 item) — should close the drawer entirely.
- Panel's data fetch fails — show an error state within that panel; the rest of the stack is unaffected.
- Same panel type opened with different IDs in quick succession — only the latest push should be in the stack.
- Drawer open, user navigates to a different route — drawer must close.
- Multiple drawers on the same page — each drawer instance should have an independent stack.
