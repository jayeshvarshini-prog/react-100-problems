# 14 — Date Range Picker Component

## Problem Statement

You are building a reusable date range picker for use in analytics and reporting dashboards across a SaaS platform. The component renders a trigger button showing the selected range. Clicking it opens a two-month calendar panel. Users click a start date, then an end date to select a range. Pre-set shortcuts (Last 7 days, Last 30 days, This month, Last month, Custom) appear in a sidebar. The selected range is highlighted across both calendar months.

---

## Expected Behavior

- Clicking the trigger button opens the calendar panel positioned below it.
- The panel shows two consecutive months side by side.
- Clicking once sets the start date; a second click sets the end date (if after start date).
- Days between start and end are highlighted; start and end days have distinct "cap" styles.
- Clicking a shortcut immediately applies that range and closes the panel.
- If the user clicks an end date before the start date, the selection is reversed (earlier date becomes start).
- Hovering over a date after the start is selected previews the potential range.
- Forward/Back arrows navigate the months. The right month is always one month after the left.
- The panel closes when the user clicks outside it or presses Escape.
- An `onChange` prop is called with `{ startDate, endDate }` (ISO strings) when a range is confirmed.

---

## Required React Concepts

- `useState` — open/closed state; current view months (left and right); selection state (start, end, hover)
- `useEffect` — close on outside click; close on Escape
- `useRef` — reference to panel container for outside-click detection
- `useMemo` — derive the calendar grid (array of day objects with in-range, is-start, is-end, is-today, is-disabled flags) for each month
- `useCallback` — memoize day click, day hover, month navigation, and shortcut handlers

---

## Constraints

- No external date picker or date utility libraries. Use native `Date` object only.
- Must correctly handle month boundaries and leap years.
- Must be timezone-aware — use UTC internally to avoid DST boundary issues.
- The component must be fully controlled: accept `value: { startDate, endDate }` and `onChange` props.

---

## Edge Cases to Consider

- Start date is the last day of a month; end date is the first of the next — range highlights correctly across the month boundary.
- User selects a start date, then navigates months, then selects an end date on a different month.
- Shortcut "Last 7 days" includes today — verify end date is today in local timezone.
- Hovering before a start date is selected — must not show any preview.
- `minDate` and `maxDate` props disable days outside the allowed range.
- User clicks the same day for start and end — single-day range (start === end) must be valid.
- Leap year February — must render 29 days correctly.
