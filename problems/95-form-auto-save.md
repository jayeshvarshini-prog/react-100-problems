# 95 — Form Auto-Save with Conflict Detection

## Problem Statement

You are building an auto-saving document editor for a SaaS platform. The form auto-saves 2 seconds after the user stops typing (debounced). A "Saved" / "Saving…" / "Save failed" indicator is shown. If another user saves the same document while you are editing, a conflict is detected on your next save attempt (server returns a version conflict). You must show a conflict resolution UI.

---

## Expected Behavior

- The user edits text fields. Two seconds after the last change, an auto-save fires.
- A status indicator in the header shows: "All changes saved" (green), "Saving…" (spinner), "Save failed – Retry" (red), or "Unsaved changes" (yellow).
- If the save API returns a 409 Conflict (version mismatch), a conflict dialog appears.
- The conflict dialog shows: your version (left), the remote version (right), and buttons: "Keep Mine", "Use Theirs", "Merge Manually".
- "Keep Mine" forces saves your version. "Use Theirs" discards your changes and loads the remote version. "Merge Manually" closes the dialog for manual resolution.
- The document has a `version` field. Each successful save increments the version.

---

## Required React Concepts

- `useState` — form values, save status, conflict data `{ localVersion, remoteVersion, remoteContent }`
- `useEffect` — debounced auto-save trigger; load initial document
- `useRef` — debounce timer; current document version (to send with every save)
- `useMemo` — derive whether there are unsaved changes from comparing current values to last-saved values
- `useCallback` — memoize save function, conflict resolution handlers
- Custom hook (`useAutoSave`) — accept form values and save function; return `{ saveStatus, triggerSave, lastSavedAt }`

---

## Constraints

- The version number must be stored in `useRef` and updated after every successful save.
- Debounce must be implemented with `useRef`-based timer.
- "Unsaved changes" must be derived by comparing current form values to last-saved values (deep comparison).
- Force-save ("Keep Mine") must include a `force: true` flag or the current version in the payload.

---

## Edge Cases to Consider

- Auto-save fires while the user is still typing (fast typer) — debounce must reset the timer.
- Save fails due to network error (not a conflict) — show "Save failed" with a Retry button; retry on click.
- Conflict dialog open and user continues typing — the typing must be preserved in local state.
- "Use Theirs" loads remote content — subsequent auto-save should send the remote version number, not the old local one.
- Document saved successfully, then user immediately edits and triggers another save — the version number must have been updated from the first save.
- Two rapid auto-saves triggered — must serialize (the second must wait for the first to complete).
