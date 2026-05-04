# 102 — Relative Time Display

## Problem Statement

Build a component that converts absolute timestamps into human-readable relative strings like "just now", "3 minutes ago", "yesterday", "2 weeks ago", and "in 5 hours". Show a list of sample timestamps at varying offsets (past and future) and display the relative label next to each. The labels must auto-update every second so the user can watch "59 seconds ago" tick to "1 minute ago" in real time. Implement the conversion logic yourself — no `Intl.RelativeTimeFormat` shortcut.

---

## Expected Behavior

- At least 10 sample dates are shown (mix of past and future).
- Each row shows the absolute date/time alongside the relative label.
- Labels tick forward every second via a single `setInterval`.
- Thresholds (implement all of these):
  | Condition | Label |
  |---|---|
  | < 5 seconds | "just now" |
  | < 60 seconds | "N seconds ago" |
  | < 60 minutes | "N minutes ago" |
  | < 24 hours | "N hours ago" |
  | exactly 1 day | "yesterday" / "tomorrow" |
  | < 7 days | "N days ago" |
  | < 5 weeks | "N weeks ago" |
  | < 12 months | "N months ago" |
  | ≥ 12 months | "N years ago" |
- Future dates use "from now" phrasing ("in 3 hours", "tomorrow", "in 2 weeks").

---

## Where to Start — Interview Approach

### Step 1: Write the pure conversion function first
```js
function relativeTime(date) {
  const diff = Date.now() - date.getTime(); // positive = past, negative = future
  const abs  = Math.abs(diff);
  const future = diff < 0;
  // thresholds in ascending order...
}
```
Test it in isolation before wiring it to React state.

### Step 2: State shape
```
{ tick: 0 }   // increment every second to force re-render
```
The sample dates are constants — only `tick` drives re-evaluation.

### Step 3: The interval
```js
useEffect(() => {
  const id = setInterval(() => setTick(t => t + 1), 1000);
  return () => clearInterval(id);   // cleanup is mandatory
}, []);
```

### Step 4: Derive labels at render time
```js
const rows = SAMPLES.map(({ label, date }) => ({
  label,
  date,
  relative: relativeTime(date),
}));
```
No state for `relative` — it is derived from the tick-driven re-render.

---

## Required React Concepts

- `useState` — single tick counter (or `useReducer` with a `tick` action)
- `useEffect` — set up and tear down the `setInterval`
- Derived values — relative labels are computed at render, not stored in state

---

## Constraints

- No `Intl.RelativeTimeFormat`. Write the threshold logic manually.
- A single interval drives all labels — do not create one interval per row.
- The interval must be cleared on unmount.
- The `relativeTime` function must be a pure function defined outside the component.

---

## Performance Notes

| Risk | Solution |
|---|---|
| One interval per row | Use a single interval that increments a shared tick |
| `relativeTime` called needlessly | It's O(1) and pure — no memoization needed |
| Memory leak from stale interval | Always return `clearInterval` from the effect |

---

## Edge Cases to Consider

- Exactly 60 seconds — should display "1 minute ago", not "60 seconds ago".
- Future dates — sign of `diff` determines "ago" vs "from now".
- The "yesterday"/"tomorrow" boundary: 23h 59m is still "23 hours ago", only ≥ 24h flips to "yesterday".
- Component unmounts at the exact moment the interval fires — cleanup prevents setState on unmounted component.
- Server-rendered HTML vs client time — if the server renders one label and the client hydrates with a different one, a hydration mismatch occurs. Not required to solve here, but worth mentioning in an interview.
