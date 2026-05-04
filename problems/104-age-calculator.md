# 104 — Age Calculator

## Problem Statement

Build an age calculator that accepts a date of birth and displays the person's exact age as years, months, and days. Also show derived stats: total days lived, total weeks, total months, total hours, and how many days remain until the next birthday. The component must handle month-end edge cases correctly (e.g., born on Jan 31, calculating from Feb 28).

---

## Expected Behavior

- A single date input for date of birth. `max` attribute set to today to prevent future dates.
- Primary display: "X years, Y months, Z days"
- Secondary stats grid: total days, total weeks, total months, total hours, days to next birthday.
- If today IS the birthday, show a special "🎂 Today!" indicator.
- Defaults to a non-trivial example date (e.g., 1995-06-15) on mount.
- All values update immediately when the date changes.

---

## Where to Start — Interview Approach

### Step 1: State shape
```
{ dob: 'YYYY-MM-DD' }
```
Everything else is derived from `dob` and the current date.

### Step 2: The borrow algorithm (years/months/days)
```js
function calcAge(dob) {
  const now   = new Date();
  const birth = new Date(dob + 'T00:00:00');

  let years  = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth()    - birth.getMonth();
  let days   = now.getDate()     - birth.getDate();

  // borrow from months if days is negative
  if (days < 0) {
    months--;
    // days in the previous month
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  // borrow from years if months is negative
  if (months < 0) { years--; months += 12; }

  return { years, months, days };
}
```

### Step 3: Total stats
```js
const totalDays   = Math.floor((now - birth) / 86_400_000);
const totalWeeks  = Math.floor(totalDays / 7);
const totalMonths = years * 12 + months;
const totalHours  = totalDays * 24;
```

### Step 4: Days to next birthday
```js
const next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
if (next < now) next.setFullYear(now.getFullYear() + 1);
const daysToNext = Math.ceil((next - now) / 86_400_000);
```

---

## Required React Concepts

- `useState` — one state: dob string
- No `useEffect` — all calculations are synchronous and pure
- Controlled input with `max` attribute

---

## Constraints

- No date libraries. Pure JS only.
- The borrow algorithm (borrowing days from the previous month) must be implemented correctly.
- `max={today}` must be set on the input to block future birth dates.

---

## Edge Cases to Consider

- Born on a leap day (Feb 29) — in non-leap years the birthday effectively becomes March 1. Decide which convention your app uses and document it.
- Born today — age is 0 years, 0 months, 0 days. Days to next birthday = 365 (or 366).
- Very old ages (> 100 years) — large numbers must format with `toLocaleString()` for readability.
- Month-end borrowing: born Jan 31, calculating on Feb 28 — days must borrow from the previous month's actual day count, not a fixed 30.
- Negative total hours — impossible if `max` is enforced on the input, but guard defensively.
