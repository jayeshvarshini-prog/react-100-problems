# 26 — User Profile Settings Page

## Problem Statement

You are building the user profile settings page for a SaaS platform. The page allows users to update their display name, email, avatar, password, and notification preferences. Each section is independently editable with its own Save button. Changes to email require re-entering the current password for confirmation. Uploading a new avatar shows a preview before saving. Unsaved changes in any section are tracked and a "You have unsaved changes" banner appears when navigating away.

---

## Expected Behavior

- Each settings section (Profile, Security, Notifications) has its own form and Save button.
- Saving a section calls its own API endpoint independently.
- While saving, the section's Save button shows a loading spinner.
- A success toast appears when a section saves successfully.
- Changing email shows an additional "Confirm password" input.
- Avatar upload shows a circular preview before the user confirms the upload.
- Navigating away with unsaved changes shows a confirmation dialog ("Leave without saving?").
- Form fields show server-side validation errors inline after a failed save.

---

## Required React Concepts

- `useState` — per-section form values, dirty flags, saving state, server errors
- `useEffect` — listen to navigation events (beforeunload, router change) to warn about unsaved changes
- `useRef` — file input ref for triggering avatar file picker programmatically
- `useCallback` — memoize section save handlers, avatar change handler
- `useMemo` — derive per-section dirty state from comparing current values to initial loaded values
- Custom hook (`useUnsavedChanges`) — track dirty state globally across all sections and attach navigation guard

---

## Constraints

- Each section's save state must be independent — saving Profile must not lock the Security section.
- Avatar preview must use `FileReader` or `URL.createObjectURL`, not upload to the server immediately.
- The "unsaved changes" guard must fire on both browser tab close (`beforeunload`) and in-app navigation.
- No external form libraries.

---

## Edge Cases to Consider

- User changes their email to the current email — should show "Email is already your current address" without an API call.
- Avatar file is not an image (e.g., a PDF) — reject with an inline error.
- Save fails with a network error (no server response) — show generic error, not field-level errors.
- User resets a field to its original value — dirty flag must correctly clear.
- Two sections saved simultaneously — both spinners must appear and resolve independently.
- Session expires while user is editing — save attempt returns 401; redirect to login while preserving (if possible) the unsaved data.
