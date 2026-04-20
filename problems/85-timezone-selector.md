# 85 — Timezone Selector with Current Time Preview

## Problem Statement

You are building a timezone selector component for a scheduling SaaS. The selector shows a searchable list of all IANA timezone identifiers. As the user types, matching timezones are filtered. Selecting a timezone shows a preview of the current time in that zone, updating every second. The component is controlled and persists the selected timezone to the user's profile.

---

## Expected Behavior

- Clicking the selector opens a searchable dropdown of all IANA timezones (~600 options).
- Typing filters timezones by both the IANA name (e.g., "America/New_York") and a human-friendly alias (e.g., "Eastern Time").
- Selecting a timezone closes the dropdown and shows the timezone name on the trigger button.
- Beneath the trigger, a live clock shows the current time in the selected timezone, updating every second.
- A "My timezone" quick-select button detects the user's system timezone using `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- The selected timezone is saved to the API on selection (debounced 1 second — do not save on every rapid click).

---

## Required React Concepts

- `useState` — search query, dropdown open state
- `useEffect` — 1-second interval to update the displayed time; save-to-API debounce; close on outside click
- `useRef` — interval ID; debounce timer; dropdown container ref for outside click
- `useMemo` — filter timezone list from search query; format the current time in the selected timezone using `Intl.DateTimeFormat`
- `useCallback` — memoize timezone select handler, search change handler, "My timezone" handler
- Custom hook (`useTimezoneSelector`) — manage open/close, search, selection, live clock, and save debounce

---

## Constraints

- Timezone list must be a static data array bundled with the component (no API fetch for the list).
- Current time display must use `Intl.DateTimeFormat` with the selected IANA timezone — no manual UTC offset calculation.
- The live clock interval must be cleared on component unmount and restarted when the timezone changes.
- No external timezone libraries.

---

## Edge Cases to Consider

- User's browser does not support `Intl.DateTimeFormat` with `timeZone` option (older browser) — show the timezone name without a clock, with a note.
- Search query returns 0 matches — show "No timezones found."
- Selected timezone is invalid (loaded from old user profile data) — fall back to UTC and show a warning.
- Dropdown has 600 items — must render with virtualization or windowing to avoid slow initial render.
- User rapidly clicks different timezones (5 in 1 second) — API save is debounced; only the last one fires.
- DST change during the session — `Intl.DateTimeFormat` handles this automatically; verify the clock is correct.
