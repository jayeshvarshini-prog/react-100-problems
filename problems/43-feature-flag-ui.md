# 43 — Feature Flag Management UI

## Problem Statement

You are building the feature flag management dashboard for a SaaS platform's internal tooling. Flags can be boolean (on/off), percentage rollout (0–100%), or user-segment targeted. The dashboard lists all flags with their current state, a rollout percentage bar, and a toggle switch. Toggling a flag updates it immediately (optimistic update). Flags can be filtered by environment (production, staging, development) and by status.

---

## Expected Behavior

- All feature flags are fetched on mount and displayed in a searchable list.
- Each flag row shows: flag key, description, type (boolean/percentage/segment), current value, and a toggle or percentage input.
- Toggling a boolean flag calls the API and optimistically updates the toggle.
- Updating a percentage (typing a new value) debounces 500ms before calling the API.
- If an API call fails, the flag reverts to its previous value and a toast appears.
- An environment switcher at the top (Production / Staging / Development) re-fetches flags for that environment.
- Flags can be searched by key name (client-side, instant).

---

## Required React Concepts

- `useReducer` — manage flags list with LOAD, UPDATE_FLAG, REVERT_FLAG actions
- `useState` — environment, search query
- `useEffect` — fetch flags when environment changes
- `useRef` — debounce timers per flag ID for percentage updates; snapshot of pre-mutation values for revert
- `useCallback` — memoize toggle and percentage change handlers; each flag's revert function
- `useMemo` — derive client-side filtered list from search query
- Custom hook (`useFlagMutation`) — handle optimistic update, API call, revert on failure, and toast notification

---

## Constraints

- Optimistic updates must happen before the API call — do not wait for server response to toggle the UI.
- Each flag's revert snapshot must be captured at the moment of mutation, not at render time.
- Percentage input must accept only integers 0–100.
- No external feature flag SDKs — this is a UI for managing flags, not consuming them.

---

## Edge Cases to Consider

- Toggle fires and API returns a 503 — revert toggle, show toast. User immediately retries — must work.
- Percentage input changed from 50 to 75 to 100 rapidly — only the last value (100) should be sent to the API.
- Percentage update in-flight, user also toggles the flag off — must sequence or cancel correctly.
- Flag key contains special characters — must display correctly in the search filter.
- Switching environment while a mutation is in-flight — the mutation's revert must still target the correct flag.
- 0 flags match search — show "No flags matching 'xyz'" message.
