# 80 — Metric Card with Animated Count-Up and Trend

## Problem Statement

You are building a reusable metric card component for analytics dashboards. The card displays a KPI value (e.g., "$48,320"), a label, a trend arrow (+12.4% vs. last period), and a mini sparkline. When the value changes (new data loaded), the number animates from the old value to the new value over 800ms using an easing function. The sparkline updates to reflect the new data series.

---

## Expected Behavior

- The card displays a formatted number (currency, percentage, or plain based on a `format` prop).
- When the `value` prop changes, the displayed number animates from the previous value to the new value over 800ms.
- Animation uses an ease-out curve (fast start, slow end).
- Trend is shown as an arrow + percentage. Positive trend is green; negative is red; zero is gray.
- The sparkline below the metric shows the last 7 data points as a small line chart (SVG-based).
- The animation must be cancellable — if `value` changes again before animation ends, it starts from the current animated value.

---

## Required React Concepts

- `useState` — current displayed value (the animated in-progress value)
- `useEffect` — start animation when `value` prop changes; cancel previous animation on new change or unmount
- `useRef` — `requestAnimationFrame` ID for cancellation; animation start time; animation start value; animation target value
- `useMemo` — derive trend percentage and direction from `value` and `previousValue` props; derive sparkline path from data array
- `useCallback` — memoize the animation frame handler

---

## Constraints

- Animation must use `requestAnimationFrame` — not CSS transitions or `setInterval`.
- The displayed number must be formatted at every frame (e.g., "$48,123.45") — use `Intl.NumberFormat`.
- Ease-out function: `1 - (1 - progress)^3` where `progress` is 0–1.
- If the animation completes normally, the displayed value must snap exactly to `value` (no floating-point drift).
- The sparkline SVG must be generated in `useMemo` from the data array (not in render).

---

## Edge Cases to Consider

- `value` changes to the same value — animation must not fire (no-op).
- `value` changes from 0 to 1,000,000 — animation must not produce visible flickering or jump to the end prematurely.
- Component unmounts while animation is in progress — `cancelAnimationFrame` must be called.
- `format` prop changes while animation is in progress — must apply the new format immediately to each frame.
- Sparkline data array has fewer than 2 points — render a flat line or hide the sparkline.
- Negative `value` (e.g., net loss) — format correctly with negative sign.
