# 46 — Collaborative Presence Indicator (Who's Online)

## Problem Statement

You are building a "who's currently viewing this document" feature for a collaborative SaaS editor. When multiple users have the same document open, each user's avatar appears in the header with a colored ring. Hovering an avatar shows the user's name and how long they've been active. Users who have been idle for 5+ minutes are shown with a grayed-out avatar. Your own avatar is always shown first with a "You" label.

---

## Expected Behavior

- On mount, a heartbeat is sent to the API every 30 seconds to register presence.
- The presence list is polled every 10 seconds to refresh the list of viewers.
- Each viewer is shown as a circular avatar. If more than 5 viewers are present, show "+N" overflow indicator.
- A viewer inactive for 5+ minutes has their avatar shown at 50% opacity.
- Hovering an avatar shows a tooltip: name, "Active X minutes ago" or "Active now".
- Your own avatar always appears first with a "You" badge.
- When you navigate away or close the tab, a `navigator.sendBeacon` call removes your presence.

---

## Required React Concepts

- `useState` — presence list, current user ID
- `useEffect` — start heartbeat interval on mount (every 30s); start poll interval (every 10s); clean up both on unmount; attach `beforeunload` event for beacon
- `useRef` — heartbeat interval ID; poll interval ID; document ID for the beacon payload
- `useMemo` — derive sorted presence list (self first, then by last-seen); derive active vs. idle status per viewer; derive overflow count
- `useCallback` — memoize heartbeat and poll fetch functions
- Custom hook (`usePresence`) — encapsulate all heartbeat, polling, and beacon logic; return the presence list

---

## Constraints

- Heartbeat and poll must be separate intervals with different cadences (30s and 10s).
- `navigator.sendBeacon` must be used for the leave notification (not `fetch` — the page may be unloading).
- Both intervals must be cleared on component unmount to avoid memory leaks.
- Presence data from the API must be a flat array; sort/filter derived in `useMemo`.

---

## Edge Cases to Consider

- Browser tab is hidden (document.visibilityState === 'hidden') — pause heartbeat to reduce server load; resume on visibility.
- Poll returns a viewer who is no longer online (presence expired server-side) — they are simply not in the list; no client-side cleanup needed.
- Two tabs by the same user on the same document — they appear as separate presence entries; "You" badge applies to the current tab's session ID only.
- Poll fails due to network error — do not clear the existing presence list; retry on next poll cycle.
- 0 other viewers — display only your own avatar; no overflow indicator.
