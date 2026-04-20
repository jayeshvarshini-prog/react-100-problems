# 15 — Role-Based Access Control UI

## Problem Statement

You are implementing the UI access control layer for a multi-role SaaS admin dashboard. Roles include: SuperAdmin, Admin, Manager, Viewer. Each role has a different set of permitted UI actions defined in a permissions config. Components must conditionally render actions (edit buttons, delete buttons, admin-only panels) based on the current user's role. Unauthorized direct URL access to protected routes must redirect to a 403 page.

---

## Expected Behavior

- The current user's role is loaded from the auth context on app init.
- UI elements that require a specific permission are hidden for users without that permission.
- A `<PermissionGate permission="users:delete">` wrapper component renders its children only if the user has the permission; otherwise renders nothing or a fallback.
- Route-level protection: navigating to `/admin/settings` as a Viewer redirects to `/403`.
- Admin-only sections display a "You don't have access" message rather than crashing.
- Permissions are checked synchronously (no async lookups during render).
- A `usePermission(permission)` hook returns a boolean and can be used inline.

---

## Required React Concepts

- `useContext` — access auth context (user role, permissions list)
- `useMemo` — derive the user's full permissions set from their role using the permissions config
- Custom hook (`usePermission`) — accept a permission string and return `hasPermission: boolean`
- HOC pattern (`withPermission`) — wrap a component so it only renders if the user has the required permission; otherwise render a fallback
- `useEffect` — in route guards, redirect unauthorized users after mount

---

## Constraints

- Permissions config must be a static data structure (not an API call) that maps roles to permission arrays.
- Permission checks must never block rendering — they must be synchronous.
- The HOC and hook approaches must be interchangeable (same underlying logic).
- Hiding a UI element must never be a substitute for server-side authorization.

---

## Edge Cases to Consider

- User's role is changed server-side while they are logged in — the client must re-derive permissions from the updated role.
- Permission string has a typo (e.g., `"users:delet"`) — should fail closed (deny access), not open.
- User has SuperAdmin role — should automatically pass all permission checks.
- Component renders during auth loading (role not yet known) — must not flash protected content.
- Multiple roles per user (if extended) — union of permissions should apply.
- Nested permission gates — outer gate denies, inner gate should never render to avoid unintended data fetching.
