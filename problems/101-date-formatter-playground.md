# 101 — Date Formatter Playground

## Problem Statement

Build a component where the user picks any date using a native `<input type="date">` and sees that date rendered in every common format simultaneously — ISO 8601, US long, EU long, short numeric, with weekday, with time (12h and 24h), Unix timestamp (seconds and milliseconds), quarter, week number, and day-of-year. Each format must update instantly as the date changes. The table layout must make it easy to compare formats side by side.

---

## Expected Behavior

- A date input defaults to today's date on mount.
- Changing the date instantly updates every format row without any extra button click.
- At least 15 distinct format outputs are shown in a table (label | output).
- Formats include: ISO 8601, US long, EU long, MM/DD/YYYY, DD/MM/YYYY, with weekday, with 12h time, with 24h time, full ISO string, UTC string, Unix seconds, Unix milliseconds, Month+Year only, Quarter (Q1–Q4), Week number, Day of year.
- All formatting uses native `Date` methods — no external libraries.

---

## Where to Start — Interview Approach

### Step 1: State shape
```
{ dateStr: '2025-04-29' }   // controlled input value (YYYY-MM-DD string)
```
Derive a `Date` object from `dateStr` — no need to store it in state.

### Step 2: The timezone trap
`new Date('2025-04-29')` parses as UTC midnight, causing off-by-one-day bugs for users west of UTC. Fix: append `T12:00:00` to force local noon.
```js
const date = new Date(dateStr + 'T12:00:00');
```

### Step 3: Format table data
Define formats as a static array of `{ label, fn }` objects outside the component. `fn` is a pure function `(date: Date) => string`. Map over them in JSX — no logic inside the render.

### Step 4: Key format patterns
```js
// ISO
date.toISOString().slice(0, 10)

// Intl / toLocaleDateString
date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

// Unix
Math.floor(date.getTime() / 1000)

// Quarter
`Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`

// Week number
const start = new Date(date.getFullYear(), 0, 1);
Math.ceil(((date - start) / 86400000 + start.getDay() + 1) / 7)
```

---

## Required React Concepts

- `useState` — one piece of state: the date string from the input
- No `useEffect` needed — formatting is pure and synchronous

---

## Constraints

- No date libraries (no date-fns, no dayjs, no moment). Native `Date` API only.
- All formats must update on each input change with zero debounce.
- Format functions must live outside the component (they are pure and stateless).

---

## Edge Cases to Consider

- Timezone offset causing the displayed date to be one day behind — fix with `T12:00:00` suffix.
- Leap year dates (Feb 29) — the `<input type="date">` handles validation; your Date math must not assume 28 days in February.
- Week 53 — some years have 53 ISO weeks; your formula must handle year boundaries.
- Very old dates (e.g., year 1900) — `toLocaleDateString` may behave inconsistently across browsers.
- Unix timestamp for dates before 1970 — returns a negative number; this is correct but worth noting.
