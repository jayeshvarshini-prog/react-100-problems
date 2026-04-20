# 100 — Full-Stack Admin Panel Integration Challenge

## Problem Statement

You are building the core admin panel for a production-grade multi-tenant SaaS application. This is a capstone challenge integrating all major React engineering concepts. The panel includes: authentication with token refresh, role-based access control, multi-tenant workspace context, a real-time notification system, a customizable dashboard, a data table with bulk actions, an audit log viewer, and a settings page with auto-save. Everything must work together cohesively.

---

## Expected Behavior

**Authentication Layer:**
- JWT auth with silent token refresh. Protected routes redirect to login. Logout clears all state.

**RBAC:**
- Role-based permissions control which nav items, actions, and data are visible.
- Dynamically loaded permissions from the API.

**Workspace Context:**
- Multi-tenant workspace switcher in the header. All API calls use the active workspace context.

**Dashboard:**
- Customizable widget layout, persisted per user. Widgets load data independently.
- A date-range filter at the top affects all widgets.

**Data Table:**
- Users table with server-side pagination, sort, filter, bulk actions, and inline role editing.
- Optimistic updates with rollback on failure.

**Real-Time Notifications:**
- WebSocket-based notification system. Bell icon with unread count badge.

**Audit Log:**
- Paginated, filterable audit log viewer. Expandable rows showing JSON diffs.

**Settings:**
- Multi-section settings page with independent auto-save per section. Unsaved changes guard on navigation.

---

## Required React Concepts

- `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useReducer` — all used across subsystems
- `useContext` — auth, workspace, permissions, notifications, theme
- Custom hooks — `useAuth`, `useWorkspace`, `usePermission`, `useNotifications`, `useAutoSave`, `useAuditLog`
- HOC patterns — `withPermission`, `withErrorBoundary`
- Error boundaries — around each major section
- Performance optimization — `React.memo` on table rows, widget cards; `useCallback` for stable handlers; `useMemo` for derived data
- Portal rendering — modals, toasts, context menus

---

## Constraints

- All subsystems must share a single React context tree with no redundant re-renders.
- Each subsystem's data fetching must use `AbortController` to cancel on unmount or context change.
- The app must not crash if any single subsystem fails — error boundaries must isolate failures.
- The final render of the dashboard must load in under 3 seconds on a simulated 3G connection (optimize bundle splitting, lazy-load routes).
- No external state management library (no Redux, Zustand, MobX).
- No external UI component library (all UI built from scratch).

---

## Edge Cases to Consider

- Token expires while submitting a bulk action — the refresh must complete, then the action must retry.
- Workspace switches while a modal is open — the modal must close and data must re-fetch for the new workspace.
- All WebSocket connections drop simultaneously (network blip) — all reconnect with staggered backoff to avoid thundering herd.
- User's role is downgraded server-side mid-session — the next permission check must reflect the new role; do not wait for re-login.
- Audit log and data table both filter by the same date range — they must operate independently (no shared filter state).
- Settings auto-save and workspace switch happen simultaneously — must not corrupt the save payload with cross-workspace data.
- 10 concurrent bulk action confirmations fire at once (unlikely but possible) — all must resolve or fail independently without mutual interference.
- The entire dashboard renders correctly on a 1280px screen, a 768px tablet, and a 375px phone.
