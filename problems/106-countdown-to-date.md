# 106 — Countdown to Date

## Problem Statement

Build a live countdown timer that counts down to a user-selected future date and time. Display the remaining time broken into days, hours, minutes, and seconds — each in its own card. The countdown must tick in real time (every second). When the target time is reached, replace the cards with a "Time's up!" message. The user can change the target at any time and the timer resets immediately.

---

## Expected Behavior

- A `<input type="datetime-local">` lets the user pick the target date and time.
- Default target is 7 days from now.
- Four cards: Days, Hours, Minutes, Seconds — all with zero-padded two-digit display.
- Values update every second.
- When the countdown reaches zero, the cards disappear and "Time's up!" is shown.
- Changing the target mid-countdown resets the display immediately.
- Negative targets (past dates) immediately show "Time's up!" without negative numbers.

---

## Where to Start — Interview Approach

### Step 1: State shape
```
{ targetStr: '2025-05-06T12:00' }   // datetime-local string
```
The countdown values are derived at render time, not stored in state.

### Step 2: The derivation function
```js
function getCountdown(targetDate) {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return null; // signal "time's up"

  const totalSecs = Math.floor(diff / 1000);
  return {
    days:    Math.floor(totalSecs / 86400),
    hours:   Math.floor((totalSecs % 86400) / 3600),
    minutes: Math.floor((totalSecs % 3600) / 60),
    seconds: totalSecs % 60,
  };
}
```

### Step 3: The interval — depend on `targetStr`
```js
useEffect(() => {
  const target = new Date(targetStr);
  const id = setInterval(() => {
    setCountdown(getCountdown(target));
  }, 1000);
  // Compute immediately to avoid 1-second blank flash
  setCountdown(getCountdown(target));
  return () => clearInterval(id);
}, [targetStr]);
```
Depending on `targetStr` means the effect re-runs (and the interval resets) every time the user picks a new date — which is exactly what you want.

### Step 4: Zero-padding
```js
String(value).padStart(2, '0')
```

---

## Required React Concepts

- `useState` — target string + countdown object
- `useEffect` — create and destroy the `setInterval`; re-runs when target changes
- Cleanup — `return () => clearInterval(id)` is mandatory

---

## Constraints

- No moment.js, no date-fns. Pure JS.
- A single `setInterval` handles all four units — do not create four separate intervals.
- The interval must be cleared on unmount AND when the target changes.
- Display must use tabular/monospace numbers so the layout doesn't shift each second.

---

## Edge Cases to Consider

- User picks a past date — immediately show "Time's up!" with no flash of negative numbers.
- User changes the target while the countdown is running — the old interval must be cleared before the new one starts (useEffect cleanup handles this).
- Component unmounts mid-countdown — interval must be cleared to prevent setState on an unmounted component.
- Exactly 0 seconds remaining — should show "Time's up!", not "00:00:00:00".
- The 1-second gap on mount — calling `getCountdown` synchronously before the first tick prevents a one-second blank state.
- Browser tab goes to background — `setInterval` may drift or be throttled. For production, recalculate `diff` from `Date.now()` inside the interval callback rather than decrementing a counter.
