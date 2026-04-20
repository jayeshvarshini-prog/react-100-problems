# 08 — Global Modal Manager

## Problem Statement

You are building a reusable modal system for a large SaaS admin dashboard that needs many different modal dialogs: confirmation dialogs, form modals, image previews, and custom content panels. Instead of each component managing its own modal open/close state, you must design a centralized modal manager that lets any component in the tree imperatively open a modal by type, pass props to it, and optionally receive a result (e.g., confirm/cancel) via a Promise.

---

## Expected Behavior

- Any component can call `openModal('ConfirmDelete', { itemName: 'Report #42' })` without managing local open/close state.
- The modal manager renders the correct modal component based on the type string.
- Modals can be stacked (one modal opens another). A backdrop appears behind the top-most modal.
- Closing the top modal reveals the one beneath it.
- `openModal` returns a Promise that resolves with the modal's result (e.g., `{ confirmed: true }` or `null` for dismiss).
- Pressing Escape closes the top-most modal, resolving the Promise with `null`.
- Clicking the backdrop closes the modal (configurable — some modals should block backdrop close).

---

## Required React Concepts

- `useReducer` — manage the modal stack (array of `{ type, props, resolve }` objects)
- `useContext` — provide `openModal` and `closeModal` functions throughout the component tree
- `useRef` — hold the resolve function for each modal's promise
- `useEffect` — attach and clean up Escape key listener
- Custom hook (`useModal`) — expose `openModal` to consuming components cleanly
- HOC pattern — optionally wrap modal components with a `withModal` HOC that injects close/resolve handlers

---

## Constraints

- Modal stack must support at least 3 levels of nesting.
- Focus must be trapped inside the topmost modal when open (tab key must not leave the modal).
- When the top modal closes, focus must return to the element that triggered it.
- No external modal libraries.
- The modal registry (mapping type strings to components) must be easy to extend.

---

## Edge Cases to Consider

- Opening the same modal type twice simultaneously — both should appear as separate stack entries.
- Modal A opens Modal B, user presses Escape — only Modal B closes.
- Component that called `openModal` unmounts before the modal closes — the resolve function must still work.
- Modal with a form inside — closing with unsaved changes should trigger a "discard changes?" confirmation (modal within modal).
- Very long modal content — should scroll internally, not make the page scroll.
- Mobile viewport — modal should be full-screen on small screens.
