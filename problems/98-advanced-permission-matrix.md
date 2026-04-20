# 98 — Advanced Permission Matrix Editor

## Problem Statement

You are building a permission matrix editor for a multi-role, multi-resource SaaS platform. The matrix is a table where rows are roles and columns are resources. Each cell is a permission level: None, Read, Write, Admin. Changing a cell value fires an API call. The matrix supports "inheritance": if a role inherits from another role, its permissions show the effective permission (max of own + inherited). Changes propagate to inheriting roles in real time in the UI.

---

## Expected Behavior

- The matrix table renders rows (roles) × columns (resources) with a dropdown per cell.
- Each dropdown shows: None, Read, Write, Admin.
- Cells for inherited roles show the effective permission level with an "(inherited)" badge if the value comes from the parent role.
- Changing a cell fires an API PATCH call. While in-flight, the cell shows a spinner.
- On failure, the cell reverts to its previous value and shows a tooltip error.
- A "View effective permissions" toggle shows only the resolved (effective) matrix, collapsing inheritance for readability.
- Roles that are "System" roles have all cells disabled (read-only).

---

## Required React Concepts

- `useReducer` — matrix state: `{ roles, resources, permissions: { [roleId]: { [resourceId]: level } } }` with UPDATE_PERMISSION, REVERT_PERMISSION, LOAD actions
- `useState` — show effective permissions toggle, cell-level loading/error states (Map)
- `useMemo` — derive effective permission matrix by resolving inheritance chains; derive disabled cells for system roles
- `useCallback` — memoize per-cell change handler, revert handler
- `useRef` — Map of pre-mutation snapshots per cell for revert on failure

---

## Constraints

- Permission inheritance must be resolved in `useMemo` — the raw permissions (not resolved) are stored in state.
- Inheritance resolution must handle chains of depth up to 5 (role A inherits B, B inherits C, etc.).
- Circular inheritance must be detected and flagged as an error (do not infinite-loop).
- Optimistic update must happen before the API call.

---

## Edge Cases to Consider

- Two cells changed simultaneously — both API calls must fire independently; failures revert only their own cell.
- Role inherits from a deleted role — must handle gracefully; treat as "no inheritance."
- Permission level "Admin" changed to "None" for an admin role — all inheriting roles that derived "Admin" from this role must update.
- Resource column added after initial load — matrix must accommodate new columns without re-fetching.
- System role permission cell dropdown — must be visually disabled but still show the current value.
- Very large matrix (20 roles × 50 resources) — `useMemo` for inheritance resolution must not cause lag on every cell change.
