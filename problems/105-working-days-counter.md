# 105 — Working Days Counter

## Problem Statement

Build a working days counter that accepts a start and end date, then calculates how many of those days are working days (Monday–Friday). Add a toggle to also exclude a hardcoded list of public holidays. Display three summary cards: total calendar days, working days, and non-working days. The count must update instantly on any input change.

---

## Expected Behavior

- Two date inputs: start and end.
- Summary cards: Calendar Days, Working Days, Non-working Days.
- A checkbox: "Exclude public holidays" — when checked, matching dates in the holiday list are also subtracted.
- Error message if end < start.
- All calculations happen synchronously on render.

---

## Where to Start — Interview Approach

### Step 1: State shape
```
{
  startDate:       'YYYY-MM-DD',
  endDate:         'YYYY-MM-DD',
  excludeHolidays: false,
}
```

### Step 2: The counting loop
```js
function countWorkingDays(start, end, holidays = []) {
  let count = 0;
  const curr = new Date(start);
  curr.setHours(12); // avoid DST issues
  while (curr <= end) {
    const dow = curr.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const iso = curr.toISOString().slice(0, 10);
    if (!isWeekend && !holidays.includes(iso)) count++;
    curr.setDate(curr.getDate() + 1);
  }
  return count;
}
```

### Step 3: Holiday list
Define holidays as an array of `'YYYY-MM-DD'` strings outside the component:
```js
const HOLIDAYS = ['2025-01-01', '2025-04-18', '2025-12-25', ...];
```

### Step 4: Total days
```js
const total = Math.round((end - start) / 86_400_000) + 1;
```
`+ 1` because both start and end are inclusive.

---

## Required React Concepts

- `useState` — start date, end date, checkbox boolean
- No `useEffect` — pure synchronous derivation
- Controlled checkbox: `checked={excludeHolidays}` + `onChange`

---

## Constraints

- Counting loop must use `setDate(curr.getDate() + 1)` — not timestamp arithmetic — to avoid DST gaps.
- Holiday list is hardcoded as a constant (no API call).
- Both dates are inclusive in the count.

---

## Performance Notes

| Risk | Solution |
|---|---|
| O(N) loop runs on every render | Ranges up to ~10 years are < 4000 iterations — fast enough; memoize with `useMemo` if needed |
| Holiday lookup on every iteration | Store holidays in a `Set` for O(1) lookup instead of `Array.includes` |

```js
const holidaySet = new Set(HOLIDAYS);
if (!isWeekend && !holidaySet.has(iso)) count++;
```

---

## Edge Cases to Consider

- Start equals end — 1 calendar day; 0 or 1 working day depending on the day of week.
- Range spanning a DST boundary — `setDate` on a `Date` object is DST-safe; timestamp arithmetic is not.
- Holiday falls on a weekend — should not double-count; it's already a non-working day.
- Range of 0 days (same date) — inclusive count must be 1, not 0.
- Very large range (10+ years) — consider `useMemo` so the loop doesn't re-run on unrelated state changes.
