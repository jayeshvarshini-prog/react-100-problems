# 60 — Notification Preferences Panel

## Problem Statement

You are building the notification preferences page for a SaaS platform. Users can configure which notifications they receive via Email, In-app, and Slack channels. Notifications are grouped by category (Billing, Team Activity, Security, Product Updates). Each category has channel toggles. A master "Pause all notifications" toggle disables everything. Changes are saved with a debounced auto-save (not a manual Save button). A "Saved" indicator appears after each successful save.

---

## Expected Behavior

- The page loads current preferences from the API on mount.
- Each notification category row shows three toggles (Email, In-app, Slack).
- Toggling a preference immediately updates local state and queues an auto-save after 1 second.
- If another toggle changes within that 1 second, the timer resets (debounce).
- After a successful save, a "Saved ✓" message appears briefly (2 seconds) then fades.
- "Pause all" toggle at the top overrides all other preferences to off; re-enabling restores previous per-category settings.
- A category can be fully disabled (all channels off) with a collapse behavior.

---

## Required React Concepts

- `useReducer` — manage preferences state: `{ isPaused, categories: { [id]: { email, inApp, slack } } }` with TOGGLE_CHANNEL, TOGGLE_PAUSE, LOAD actions
- `useEffect` — fetch preferences on mount; auto-save on debounced change
- `useRef` — debounce timer; snapshot of preferences before "Pause all" (for restore)
- `useState` — saved indicator visible state
- `useMemo` — derive whether the "Pause all" toggle is active; derive a serializable preferences payload for the save API call
- `useCallback` — memoize toggle handlers
- Custom hook (`useNotificationPreferences`) — encapsulate load, reduce, debounced save, and save indicator logic

---

## Constraints

- Auto-save must be debounced with a `useRef`-based timer (not `useMemo`-based).
- "Pause all" must store a snapshot of previous preferences in a `useRef`, not in main state.
- The save API call must send the full preferences object (not a diff).
- Slack channel toggle must be disabled if Slack is not connected (show tooltip: "Connect Slack first").

---

## Edge Cases to Consider

- Save fails — show an error indicator; the local state remains changed so the user can retry.
- "Pause all" activated, some toggles changed while paused, then "Pause all" deactivated — the snapshot restore must not overwrite the paused-time changes.
- User rapidly toggles the same preference on/off — only the final state is saved.
- Preferences API returns a category that is not in the local config (new category added by backend) — render it gracefully.
- Page is navigated away while an auto-save is queued — the timer fires; must not setState on unmounted component.
