# 19 — Multi-Select Dropdown Filter with Search

## Problem Statement

You are building a reusable multi-select dropdown filter component for an analytics dashboard. The component shows a trigger button with the count of selected items (or "All" if none). Clicking it opens a dropdown with a search input and a scrollable list of checkboxes. Users can select multiple options. A "Select All" checkbox toggles all options. A "Clear" button resets the selection. The parent is notified of changes only when the dropdown closes (not on each checkbox click).

---

## Expected Behavior

- Trigger button label shows: "All" (0 selected), "Status: 2 selected", or the single selected item's label.
- Opening the dropdown renders options with checkboxes and an internal search input.
- Typing in the search input filters the visible options (client-side, case-insensitive).
- "Select All" checks all currently visible options (respects the search filter).
- "Clear" unchecks all options regardless of search state.
- Closing the dropdown (click outside or Escape) calls `onChange` with the final selection.
- The dropdown is anchored to the trigger button and repositions if near the viewport edge.

---

## Required React Concepts

- `useState` — open/closed, internal pending selection (local copy before onChange fires), search query
- `useEffect` — close on outside click; close on Escape
- `useRef` — container ref for outside-click detection; trigger ref for positioning
- `useMemo` — derive filtered options from search query; derive "Select All" indeterminate state
- `useCallback` — memoize toggle, select-all, clear, close handlers
- Custom hook (`useMultiSelect`) — encapsulate selection logic and expose toggle, selectAll, clear

---

## Constraints

- The `onChange` callback must only fire when the dropdown closes, not on every checkbox interaction.
- Must handle both controlled (value prop + onChange) and uncontrolled usage.
- "Select All" when search is active should only select visible items, not all items.
- Options list must be scrollable if > 7 items are visible.

---

## Edge Cases to Consider

- All items selected via "Select All", then one item unchecked — "Select All" should show indeterminate state.
- Search returns 0 results — show "No options match" and disable "Select All".
- Options array changes while dropdown is open — visible list must update; selection of removed items is dropped.
- Very long option labels — must truncate with ellipsis, not overflow the dropdown.
- Dropdown opens near the bottom of the viewport — must render above the trigger, not get clipped.
- Component used inside a form — must not submit the form when pressing Enter in the search input.
