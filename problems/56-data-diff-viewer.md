# 56 — Data Diff Viewer (Before / After Comparison)

## Problem Statement

You are building a record diff viewer for an audit trail system. When a user views a change log entry, they see a side-by-side (or unified) view comparing the before and after state of a JSON record. Added fields are highlighted in green, removed fields in red, and changed fields show the old value (red strikethrough) and new value (green) side by side. Nested objects are expandable. Users can toggle between side-by-side and unified views.

---

## Expected Behavior

- The diff viewer accepts `before: object` and `after: object` props.
- It computes the diff on mount and displays it.
- Top-level keys are shown. Keys present in both are shown with their change status (unchanged, modified, added, removed).
- Modified values show old (red) and new (green) side by side.
- Nested objects and arrays can be expanded by clicking a toggle arrow.
- Unchanged fields can be collapsed by clicking "Hide unchanged" to reduce noise.
- Side-by-side mode shows two columns; unified mode shows a single column with +/- markers.
- Large strings (over 200 chars) use a character-level inline diff.

---

## Required React Concepts

- `useMemo` — compute the diff tree from `before` and `after` props; derive character-level diffs for long strings
- `useState` — view mode (side-by-side/unified), expanded keys set, show-unchanged toggle
- `useCallback` — memoize toggle expand handler
- Recursive component — a `DiffNode` component renders itself for nested objects
- `useRef` — reference to the diff container for keyboard navigation

---

## Constraints

- Diff computation must happen in `useMemo`, not on every render.
- Character-level diff (for long strings) must be computed purely in JavaScript — no diff library.
- Deep nested objects must not cause stack overflow — limit recursion depth to 10 levels.
- The component must be pure: given the same `before`/`after`, output is always the same.

---

## Edge Cases to Consider

- `before` is null and `after` is an object (new record) — all fields shown as added.
- `before` is an object and `after` is null (deleted record) — all fields shown as removed.
- A field type changes (e.g., string → object) — handle correctly without crashing.
- Circular references in the input objects — must detect and display "[Circular]" without infinite recursion.
- Arrays: element added, removed, or reordered — decide on a diff strategy (index-based vs. identity-based).
- Very deep nesting — `DiffNode` must stop recursing at depth 10 and show "[Max depth reached]".
