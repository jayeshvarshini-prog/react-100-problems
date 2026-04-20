# 31 — Permission Guard Component with Async Permission Loading

## Problem Statement

You are building a permission guard system for a SaaS platform where permissions are loaded asynchronously from the API after login (not embedded in the JWT). The system must support component-level guards (`<Can do="delete" on="invoice">`), route-level guards, and programmatic checks (`can('delete', 'invoice')`). While permissions are loading, guarded components show a skeleton. If permissions fail to load, the app shows a degraded-mode banner and fails closed on all permission checks.

---

## Expected Behavior

- After login, permissions are fetched from `/api/me/permissions` and stored in a context.
- `<Can do="edit" on="project">` renders its children if allowed; renders `null` or a fallback prop otherwise.
- Route-level guard component redirects to `/403` if the user lacks the required permission.
- `can('edit', 'project')` programmatic function is available via a hook.
- While permissions are loading, `<Can>` renders a neutral skeleton (or the `loading` prop).
- If permission fetch fails, all `<Can>` guards fail closed (render nothing) and a banner warns the user.
- Permissions can be re-fetched (e.g., after a role upgrade) via a `refreshPermissions()` function.

---

## Required React Concepts

- `useContext` — access permissions context (loaded permissions, loading state, error state)
- `useEffect` — fetch permissions after auth state is confirmed; re-fetch when user ID changes
- `useMemo` — build a fast O(1) permission lookup set from the permissions array
- `useState` — permissions array, loading, error
- Custom hook (`usePermission`) — expose `can(action, resource)` boolean lookup
- HOC pattern (`withPermission(permission)(Component)`) — wrap a component for route-level protection

---

## Constraints

- Permission model: `{ action: string, resource: string }` pairs (e.g., `{ action: 'delete', resource: 'invoice' }`).
- Lookup must be O(1) — build a Set or Map of `"action:resource"` strings.
- Must fail closed: any error or loading state → treat as no permission.
- `refreshPermissions` must be callable from any component via the hook.

---

## Edge Cases to Consider

- Permissions API call returns a 403 (user not allowed to fetch their own permissions) — show a critical error state.
- Permission check for a resource not in the permissions list (new feature added to backend) — must deny access.
- SuperAdmin shortcut: if user role is SuperAdmin, bypass all permission checks without fetching.
- Permissions refresh fires at the same time as another component uses `can()` — must not cause a stale check.
- Same `<Can>` component is used in 50 places on the page — must not cause 50 context subscriptions to be expensive.
