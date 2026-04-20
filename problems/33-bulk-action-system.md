# 33 — Bulk Action System for a Resource List

## Problem Statement

You are building a bulk action system for an email campaign manager. The list shows all campaigns with checkboxes. Users can select individual items, select all on the current page, or select all matching items across all pages. Bulk actions include: Archive, Delete, Duplicate, and Change Status. Each action requires a confirmation modal showing the count of affected items. After the action, the list refreshes and a success summary toast appears.

---

## Expected Behavior

- Each row has a checkbox. The table header has a "select all on this page" checkbox with indeterminate state.
- When rows are selected, a floating action bar slides up from the bottom showing available bulk actions.
- Checking "select all on page" then seeing the banner "Select all 247 matching campaigns" extends selection to all pages.
- The "Select all 247" mode is represented as a flag (not by storing 247 IDs).
- Clicking an action opens a confirmation modal: "You are about to [action] 247 campaigns."
- On confirm, the API is called with either the list of IDs or a filter payload (for "select all" mode).
- On success, selected rows are cleared, the list re-fetches, and a toast shows "247 campaigns archived."

---

## Required React Concepts

- `useState` — selectedIds (Set), isAllSelected flag (across all pages), action confirmation state
- `useMemo` — derive "select all on page" checkbox state (checked, indeterminate, unchecked); derive action button labels with count
- `useCallback` — memoize row toggle, select-all, action confirm handlers
- `useEffect` — clear selection when list re-fetches after an action
- `useReducer` — manage selection state with SELECT_ONE, DESELECT_ONE, SELECT_PAGE, SELECT_ALL, CLEAR actions

---

## Constraints

- "Select all across all pages" must not fetch all IDs into the client. Use a flag + current filter params.
- The API for bulk actions must accept either `{ ids: [...] }` or `{ filter: {...} }` based on selection mode.
- Bulk action must be atomic from the API's perspective — partial failures must be handled gracefully.
- Floating action bar must not block critical row content on mobile.

---

## Edge Cases to Consider

- User selects all on page 1, navigates to page 2, and selects one item — must this extend to "select all"? Define the behavior explicitly.
- Bulk delete on "select all 247" where some items are not deletable (e.g., sent campaigns) — show a warning: "183 of 247 campaigns will be deleted; 64 cannot be deleted."
- List re-fetches between the confirmation and the API call (items added/removed) — stale count in modal.
- Action API call times out — do not leave the selection in a stuck state.
- User deselects all items while the floating action bar is visible — it must slide back down.
