# 103 — Date Range Selector

## Problem Statement

Build a date range picker using two native `<input type="date">` controls (start and end). When both dates are selected, compute and display: total calendar days, working days (Mon–Fri), weekend days, and the percentage of the range that is working days. If the range is 60 days or fewer, render each individual date as a chip — color-coded green for working days and red for weekends. If the range exceeds 60 days, show a summary-only view.

---

## Expected Behavior

- Two date inputs: start and end. End date's `min` attribute is kept in sync with the start date.
- If end < start, show a validation error instead of results.
- Summary cards always visible (total, working, weekend, % working).
- For ranges ≤ 60 days: render one chip per date, green = working day, red = weekend.
- For ranges > 60 days: chips are hidden; summary only.
- All calculations are pure JS — no date libraries.
- Defaults to today for both inputs on mount.

---

## Where to Start — Interview Approach

### Step 1: State shape
```
{
  startDate: 'YYYY-MM-DD',
  endDate:   'YYYY-MM-DD',
}
```
Derive everything else: the Date objects, the list of days, the counts.

### Step 2: Generate the date list
```js
function getDatesInRange(start, end) {
  const dates = [];
  const curr = new Date(start);
  curr.setHours(12); // avoid DST midnight issues
  while (curr <= end) {
    dates.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}
```

### Step 3: Classify each date
```js
const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;
```
`getDay()` returns 0 = Sunday, 6 = Saturday.

### Step 4: Derive summary stats
```js
const total    = dates.length;
const weekends = dates.filter(isWeekend).length;
const working  = total - weekends;
const pct      = total ? Math.round((working / total) * 100) : 0;
```

### Step 5: Sync end's `min` attribute
```jsx
<input type="date" value={endDate} min={startDate} onChange={...} />
```

---

## Required React Concepts

- `useState` — start and end date strings
- No `useEffect` needed — all stats are derived synchronously
- Controlled inputs — both date inputs are fully controlled

---

## Constraints

- Use native `<input type="date">`. No calendar UI library.
- All date arithmetic in pure JS (no date-fns, no dayjs).
- Do not store the derived list in state — compute at render time.
- The chip list must be conditionally rendered based on range length.

---

## Edge Cases to Consider

- Same start and end date — range of 1 day. Must show 1 chip.
- Start > end — show error message, not results.
- DST transition dates (e.g., clock changes in March/October) — using noon (`T12:00:00`) avoids the 23-hour or 25-hour day bug.
- February 29 in a leap year — `setDate(curr.getDate() + 1)` handles this correctly; manual day-counting does not.
- Very large ranges (e.g., 10 years) — chip rendering would create thousands of DOM nodes; the 60-day threshold guards against this.
