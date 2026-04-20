# 22 — Toast Notification System

## Problem Statement

You are building a global toast notification system for an enterprise dashboard. Any component in the tree must be able to imperatively trigger toasts (success, error, warning, info). Multiple toasts can be visible simultaneously, stacked vertically. Each toast auto-dismisses after a configurable duration. Users can manually dismiss a toast. Toasts enter and exit with CSS animations. Position is configurable (top-right, bottom-center, etc.).

---

## Expected Behavior

- `showToast({ message, type, duration })` can be called from any component.
- Toasts appear in a fixed overlay container at the configured position.
- Up to 5 toasts are shown at once; older toasts are dismissed when a 6th arrives.
- Each toast auto-dismisses after `duration` ms (default 4000ms). Hovering over a toast pauses its timer.
- Clicking the X button on a toast dismisses it immediately.
- Toasts animate in (slide + fade) on mount and animate out on dismiss.
- The animation must complete before the toast is removed from the DOM.

---

## Required React Concepts

- `useReducer` — manage the toast queue: ADD, DISMISS, REMOVE (after animation ends)
- `useContext` — provide `showToast` to the entire component tree
- `useEffect` — start the auto-dismiss timer for each toast; clear on hover/unmount
- `useRef` — store timeout IDs per toast ID to cancel them on hover pause or manual dismiss
- `useCallback` — memoize dismiss and pause handlers
- Custom hook (`useToast`) — expose `showToast`, `showSuccess`, `showError`, `showWarning` shortcuts

---

## Constraints

- The toast container must render via a React Portal (appended to `document.body`).
- Timer pause on hover must resume correctly when the cursor leaves (subtract elapsed time).
- Removing a toast must wait for the CSS exit animation to complete before removing from DOM.
- No external notification libraries.
- `showToast` must return a toast ID that can be used to programmatically dismiss a specific toast.

---

## Edge Cases to Consider

- Component that called `showToast` unmounts before the toast auto-dismisses — toast must still dismiss on its own schedule.
- `showToast` called with `duration: Infinity` — toast should never auto-dismiss; only manual dismiss works.
- 10 toasts fired in rapid succession — only the 5 most recent should be visible; the rest are silently discarded.
- Hover-pause while 2 toasts are visible — only the hovered toast's timer is paused.
- Toast with a very long message — must not overflow the toast container; clamp to 2 lines.
- Page loses focus (tab switch) — timer behavior should be consistent (do not pause on blur unless explicitly designed).
