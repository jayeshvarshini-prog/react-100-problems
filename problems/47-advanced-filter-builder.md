# 47 — Advanced Filter Builder (Query Builder UI)

## Problem Statement

You are building a visual query/filter builder for a CRM report generator. Users can construct complex filter conditions using AND/OR logic groups, nested groups, and individual condition rows. Each condition has a field selector, an operator selector (that changes based on field type), and a value input. The resulting filter expression is serialized to a query object and passed to the parent.

---

## Expected Behavior

- The builder starts with one empty condition row.
- An "Add Condition" button adds a new condition to the current group.
- An "Add Group" button adds a nested AND/OR group.
- Each group has a toggle between AND and OR logic.
- Condition rows have: [field dropdown] [operator dropdown] [value input].
- The operator dropdown options change based on the field type (e.g., text fields show Contains/Equals/Starts With; number fields show =/≠/>/</>=/≤; date fields show Before/After/Between).
- Changing the field resets the operator and value.
- Groups can be removed (removes all child conditions). Conditions can be individually removed.
- The output query object (a recursive `{ logic, conditions }` structure) updates in real time.

---

## Required React Concepts

- `useReducer` — manage the filter tree: ADD_CONDITION, REMOVE_CONDITION, UPDATE_CONDITION, ADD_GROUP, REMOVE_GROUP, TOGGLE_LOGIC actions; the state is a recursive tree
- `useMemo` — serialize the filter tree to a query object for the `onChange` callback; derive whether the filter is valid (all conditions have non-empty values)
- `useCallback` — memoize each node's action dispatchers
- Recursive component pattern — a `FilterGroup` component renders itself for nested groups
- `useContext` — provide the field schema (field definitions and operator options) to deeply nested components without prop drilling

---

## Constraints

- Filter state must be a normalized tree structure, not a nested JavaScript object that is mutated.
- Removing a group removes all of its descendants atomically.
- A group must contain at least one condition — the last condition in a group cannot be removed (the group's own remove button removes the whole group).
- Field schema must be a prop — not hardcoded inside the component.

---

## Edge Cases to Consider

- Deeply nested groups (4+ levels) — must not crash; render correctly.
- Field changed from a text field (Contains operator) to a number field (Equals) — operator must reset.
- Date "Between" operator — must show two date inputs; other operators show one.
- User removes all conditions from a nested group by removing the group — parent group must update.
- Empty value in a condition — the query object can be flagged as invalid; the parent decides how to handle.
- Serialized query with 20+ conditions — `useMemo` re-computation must not be expensive on every keystroke.
