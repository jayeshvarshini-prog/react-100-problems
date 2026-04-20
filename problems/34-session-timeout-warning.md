# 34 — Session Timeout Warning with Activity Detection

## Problem Statement

You are building a session timeout system for a banking SaaS. The session expires after 15 minutes of inactivity. A warning modal must appear 2 minutes before expiry, giving the user the option to "Stay logged in" (which calls the refresh token endpoint) or "Log out now." Inactivity is defined as no mouse movement, keypress, or click. Any user activity resets the inactivity timer.

---

## Expected Behavior

- A 15-minute inactivity timer starts on mount.
- User activity (mousemove, keydown, click) resets the timer to 15 minutes.
- With 2 minutes remaining, a warning modal appears with a countdown ("Your session will expire in 1:47").
- While the modal is open, the countdown ticks every second.
- Clicking "Stay logged in" calls the refresh token API, closes the modal, and resets the timer.
- Clicking "Log out" calls the logout API and redirects to the login page.
- If the countdown reaches 0 with no action, the user is automatically logged out.
- The warning modal must appear even if the user switches to a background tab.

---

## Required React Concepts

- `useState` — warning modal visible, countdown seconds remaining
- `useEffect` — attach activity event listeners on mount; clean up on unmount
- `useRef` — store the inactivity timeout ID and the countdown interval ID to cancel/reset them
- `useCallback` — memoize the activity handler (must be the same function reference for addEventListener/removeEventListener)
- Custom hook (`useSessionTimeout`) — encapsulate all timer logic, activity detection, and modal trigger; return `{ showWarning, secondsRemaining, extendSession, logout }`

---

## Constraints

- Activity listener must use passive event listeners for performance.
- Must use a single debounced activity handler — not one per event type.
- The `useCallback` hook for the activity handler must be stable (no re-creation on each render).
- Session expiry timer must use `setTimeout`, not `setInterval`, for accuracy.
- All timers must be cleared on component unmount.

---

## Edge Cases to Consider

- User is on the warning modal and their session is extended by another tab — modal must detect this (via storage event) and close.
- "Stay logged in" API call fails — keep the modal open, show an error, continue the countdown.
- User leaves the page open overnight with no activity — should be logged out when they return.
- Activity event fires while modal is open — must NOT reset the timer (to avoid the modal never reaching 0).
- Multiple instances of `useSessionTimeout` on the same page (nested layouts) — must not create duplicate timers.
