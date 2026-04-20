# 12 — Real-Time Notification System

## Problem Statement

You are building the notification system for a project management platform. Notifications arrive via a WebSocket connection and are displayed in a dropdown panel accessible from the header bell icon. Unread notifications are counted in a badge. Users can mark individual notifications as read, mark all as read, and delete notifications. Notifications are also persisted so they survive page refresh. The WebSocket must automatically reconnect on disconnect.

---

## Expected Behavior

- On mount, existing notifications are loaded from the API, and a WebSocket connection is established.
- New notifications arriving via WebSocket are prepended to the list.
- The bell icon shows an unread count badge (capped at "99+" display).
- Clicking the bell opens a dropdown panel showing the 20 most recent notifications.
- Each notification shows icon, message, relative timestamp ("2 minutes ago"), and a read/unread indicator.
- Clicking a notification marks it as read and navigates to the relevant resource.
- "Mark all as read" sets all notifications to read status.
- If the WebSocket disconnects, a reconnect attempt is made with exponential backoff (max 5 retries).

---

## Required React Concepts

- `useReducer` — manage notifications array with actions: LOAD, APPEND, MARK_READ, MARK_ALL_READ, DELETE, CLEAR
- `useEffect` — open WebSocket on mount; close on unmount; handle message events
- `useRef` — hold the WebSocket instance; hold the reconnect timeout to cancel it on unmount
- `useState` — dropdown open state; connection status
- `useMemo` — derive unread count; derive the 20 most recent notifications
- Custom hook (`useWebSocket`) — encapsulate connection, reconnection logic, and message dispatch

---

## Constraints

- WebSocket URL must be configurable via an environment variable or prop.
- Reconnect must use exponential backoff: 1s, 2s, 4s, 8s, 16s — then stop.
- No external WebSocket or real-time libraries.
- Must not attempt reconnect if the component has unmounted.
- Notifications stored in localStorage must be loaded on init and synced on every change.

---

## Edge Cases to Consider

- WebSocket message arrives while dropdown is closed — badge must update without opening dropdown.
- User marks a notification as read at the same moment a new one arrives — both state changes must not conflict.
- localStorage contains corrupted JSON from a previous session — fail gracefully with an empty array.
- 100+ notifications in localStorage — only render 20 at a time in the dropdown.
- WebSocket server sends a malformed message (not valid JSON) — log the error, do not crash.
- User rapidly clicks "Mark all as read" multiple times — must not fire multiple API calls.
- Reconnect attempts exhausted — show a "Connection lost" status indicator.
