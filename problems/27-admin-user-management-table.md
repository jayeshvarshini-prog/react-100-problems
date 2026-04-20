# 27 — Admin User Management Table

## Problem Statement

You are building the user management section of a SaaS admin panel. Admins can view all users in a paginated table, search by name or email, filter by role and status, change a user's role, suspend/reactivate accounts, and delete users. Bulk actions (suspend, delete) apply to all checked rows. Each action opens a confirmation modal before executing. After any mutation, the table row updates optimistically.

---

## Expected Behavior

- Table loads users on mount, paginated server-side (page + limit sent as query params).
- Search input debounces 300ms before sending the query to the server (resets to page 1).
- Role and status filter dropdowns reset the page to 1 and re-fetch.
- Selecting a row checkbox enables the bulk action bar at the top.
- "Select all on this page" checks all visible rows; a "Select all N users" option extends to all pages.
- Clicking "Change Role" on a row opens a dropdown. Selecting a new role fires an API call and updates the row optimistically.
- "Suspend" and "Delete" actions open a confirmation modal. On confirm, the mutation fires. On cancel, nothing changes.
- After a successful delete, the row is removed with a brief fade animation.

---

## Required React Concepts

- `useState` — search query, active filters, current page, selected row IDs (Set), bulk action state
- `useEffect` — fetch users when filters/search/page change
- `useReducer` — manage users list with UPDATE_USER, REMOVE_USER, LOAD_USERS actions
- `useCallback` — memoize search handler, sort handler, row selection handler
- `useMemo` — derive whether all visible rows are selected (for "select all" checkbox state)
- `useRef` — debounce timer for search input

---

## Constraints

- Server-side pagination: the client never holds all users in memory.
- Search and filters are sent to the API, not filtered client-side.
- Bulk "select all users" must track a flag (not store all IDs) since the full list is not in memory.
- Optimistic updates must be reverted if the mutation API call fails.

---

## Edge Cases to Consider

- Current page becomes empty after a bulk delete (all rows on the page deleted) — navigate to page N-1.
- User filtered list has only 1 result matching search — table must show 1 row, not crash.
- Role change API returns 409 (role already assigned) — show inline error on the row.
- Admin tries to delete themselves — must be prevented with a clear error message.
- "Select all N users" flag active while filters change — the flag must be cleared automatically.
- Bulk delete of 50 users — fire one batch API call, not 50 individual calls.
