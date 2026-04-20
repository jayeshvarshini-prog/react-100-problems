# 86 — Recurring Event Scheduler (RRule UI)

## Problem Statement

You are building a recurrence rule configurator for a scheduling SaaS. Users configure how often an event repeats: Daily, Weekly (select days), Monthly (day of month or day of week pattern), or Yearly. The selected recurrence rule generates a human-readable summary ("Every 2 weeks on Tuesday and Thursday") and serializes to a simplified RRule string. A preview shows the next 5 occurrences.

---

## Expected Behavior

- A frequency selector: None, Daily, Weekly, Monthly, Yearly.
- "Every N [days/weeks/months/years]" interval input.
- Weekly: checkboxes for Mon–Sun.
- Monthly: radio between "On day X of the month" and "On the [first/second/third/fourth/last] [weekday] of the month."
- Yearly: month and day selectors.
- A human-readable summary updates in real time.
- "Next 5 occurrences" preview updates in real time.
- An "End date" section: Never, On date, After N occurrences.

---

## Required React Concepts

- `useReducer` — recurrence config: `{ frequency, interval, daysOfWeek, dayOfMonth, weekdayPattern, endType, endDate, endCount }`
- `useMemo` — generate the human-readable summary from the config; calculate the next 5 occurrence dates; serialize to RRule string
- `useCallback` — memoize each config change handler
- `useState` — no additional state needed beyond the reducer

---

## Constraints

- Occurrence calculation must be purely derived from the config in `useMemo` — no async computation.
- "Next 5 occurrences" must be calculated forward from today's date.
- The RRule serialization must produce a valid string format (e.g., `FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH`).
- No external RRule libraries — implement the occurrence calculation manually.

---

## Edge Cases to Consider

- Weekly frequency with no days selected — show a validation error ("Select at least one day").
- Monthly "On day 31" — months with fewer than 31 days must skip or show the last day (define the behavior).
- End "After N occurrences" with N = 0 — validate: must be ≥ 1.
- End date before today — validate: end date must be in the future.
- Interval of 0 — validate: must be ≥ 1.
- Changing frequency resets incompatible config fields (e.g., changing from Weekly to Daily clears day-of-week selections).
- Leap year February 29 — yearly recurrence on Feb 29 must handle non-leap years.
