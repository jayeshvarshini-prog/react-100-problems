# 41 — Product Configurator with Dependent Options

## Problem Statement

You are building a product configurator for a B2B hardware e-commerce platform. Users configure a server by selecting CPU, RAM, Storage, and OS. Options are interdependent: selecting a CPU tier unlocks certain RAM options; selecting RAM affects available storage; OS options depend on all previous selections. Available options and pricing are fetched from the API. A live price summary updates with each selection.

---

## Expected Behavior

- Step 1 (CPU): all CPU options are shown and selectable.
- Step 2 (RAM): options are filtered based on the selected CPU. Incompatible RAM options are shown as disabled with a tooltip.
- Step 3 (Storage): options depend on both CPU and RAM selections.
- Step 4 (OS): options are filtered based on all previous selections.
- Selecting a higher-tier option in an earlier step may invalidate a previously selected later option — that option must be cleared.
- A live price summary panel on the right updates with each selection.
- An "Add to Cart" button is enabled only when all required selections are made.

---

## Required React Concepts

- `useReducer` — manage configurator state: `{ selections: { cpu, ram, storage, os }, prices }` with SELECT_OPTION, CLEAR_DEPENDENT, LOAD_OPTIONS actions
- `useEffect` — fetch available options for each step when it becomes active or a dependency changes
- `useMemo` — derive available options per step by filtering against current selections; derive total price
- `useCallback` — memoize selection handlers per step
- Custom hook (`useConfigurator`) — manage selections, dependency invalidation, and price derivation

---

## Constraints

- Option availability rules must be encoded in a data structure (compatibility matrix), not hardcoded in JSX.
- When an upstream selection changes and invalidates a downstream selection, the downstream selection must be automatically cleared.
- All API calls for options must use `AbortController` to cancel stale requests.
- Price must be derived client-side from the base price + option prices (no price re-fetch on each selection).

---

## Edge Cases to Consider

- Only one valid option exists for a step — auto-select it; the step can still be changed.
- All RAM options are incompatible with the selected CPU — show a specific error message, not an empty list.
- User completes all steps, then changes CPU back to a lower tier — multiple downstream selections may clear.
- Price for one option is $0 — render "$0.00" correctly, not blank.
- API returns options for step 2 before step 1's selection is committed — must wait for step 1.
- Option fetch fails for step 3 — show error within that step while other steps remain functional.
