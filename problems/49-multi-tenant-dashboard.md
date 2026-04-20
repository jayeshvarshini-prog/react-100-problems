# 49 — Multi-Tenant Dashboard with Workspace Switching

## Problem Statement

You are building a multi-tenant SaaS product where one user account can belong to multiple organizations (workspaces). A workspace switcher in the header lets the user switch between their organizations. Switching workspaces changes the active API context (all subsequent API calls use the new workspace ID in the header or URL). Workspace-specific data (members, billing, settings) must be re-fetched when the workspace changes.

---

## Expected Behavior

- On login, the user's workspaces are fetched and the last-used workspace is activated.
- A workspace switcher dropdown in the header shows all workspaces. Clicking one switches context.
- Switching workspaces re-fetches the current page's data in the new workspace context.
- The active workspace ID is included in all API request headers.
- The active workspace is persisted to localStorage so it is restored on next login.
- A visual indicator in the header shows the current workspace name and avatar/logo.
- Some pages are workspace-specific (Members, Billing); others are user-specific (Profile) and do not change on workspace switch.

---

## Required React Concepts

- `useContext` — provide active workspace, workspace list, and `switchWorkspace` function to the entire app
- `useState` — active workspace ID, workspace list, loading state
- `useEffect` — fetch workspaces on login; restore last-used from localStorage
- `useMemo` — derive the active workspace object from the workspace list and active ID
- `useCallback` — memoize the `switchWorkspace` function to avoid re-renders in consumers
- Custom hook (`useWorkspace`) — expose `{ activeWorkspace, workspaces, switchWorkspace }` cleanly

---

## Constraints

- The active workspace ID must be injectable into all fetch calls — use a module-level singleton or context-based API client.
- Workspace switching must be instant (optimistic update of context), then trigger data re-fetches.
- Re-fetches on workspace switch must be triggered by components themselves reacting to the context change (via `useEffect([activeWorkspaceId])`), not by the switcher pushing data to every component.
- No global state library.

---

## Edge Cases to Consider

- User belongs to only 1 workspace — switcher must still render but show a "You're in your only workspace" message.
- Last-used workspace from localStorage no longer exists (user was removed from it) — fall back to the first available workspace.
- API call fires with old workspace ID due to stale closure in a `useEffect` — must use the workspace ID from context, not a captured variable.
- Workspace switch during a pending API call — the in-flight request should complete for the old workspace; new requests use the new workspace.
- User is an admin in workspace A but a viewer in workspace B — permissions must re-derive when the workspace changes.
