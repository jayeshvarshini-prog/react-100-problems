# 88 — API Key Manager

## Problem Statement

You are building the API key management page for a developer-focused SaaS platform. Users can generate, view, revoke, and rotate API keys. Keys are partially masked after generation (only shown once in full). Each key has a name, creation date, last-used date, expiry, and permission scopes. Multiple keys can coexist. Revoked keys are shown with a strikethrough and cannot be restored.

---

## Expected Behavior

- On mount, all API keys are fetched and displayed in a table.
- A "Generate New Key" button opens a modal for naming the key, setting an expiry, and selecting permission scopes.
- On key generation, the full key is shown once in a modal with a "Copy" button and a warning: "Store this key securely. It will not be shown again."
- Closing the modal shows the key as masked (e.g., `sk_live_••••••••••••••••7f3a`).
- A "Revoke" button opens a confirmation. On confirm, the key is revoked, shown with strikethrough, and all actions disabled.
- A "Rotate" button generates a new key value for the same key entry, showing the new full value once.

---

## Required React Concepts

- `useReducer` — manage keys list with LOAD_KEYS, ADD_KEY, REVOKE_KEY, ROTATE_KEY actions
- `useState` — generate modal open, full key value (shown once), revoke confirmation target
- `useEffect` — fetch keys on mount
- `useMemo` — derive active vs. revoked key counts; derive whether any keys are expiring soon (within 7 days)
- `useCallback` — memoize generate, revoke confirm, rotate handlers
- `useRef` — timeout for clearing the full key value from state after 30 seconds

---

## Constraints

- The full key value must be cleared from state after the user closes the modal (not kept in memory).
- Revoked keys must remain visible in the list for audit purposes — do not delete them.
- Permission scopes must be a multi-select (at least: read:data, write:data, admin, billing).
- No external key management libraries.
- Copy button must use `navigator.clipboard` with a visual "Copied!" confirmation.

---

## Edge Cases to Consider

- User closes the "new key" modal without copying — the key is gone; they must generate a new one. Show a "Are you sure you want to close? The key cannot be recovered." warning.
- Rotate on an already-revoked key — Rotate button must be disabled for revoked keys.
- Key expiry date is in the past when fetched — show an "Expired" badge alongside "Revoked" or "Active".
- Generate key API fails — do not show a partial key or any key value; show an error.
- Two keys have the same name — must be allowed (names are labels, IDs are unique).
- Last remaining key revoked — show a warning: "Revoking this key will leave you with no active keys."
