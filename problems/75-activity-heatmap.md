# 75 — Activity Heatmap (GitHub Contributions Style)

## Problem Statement

You are building a yearly activity heatmap for a developer productivity SaaS. The heatmap displays 52 weeks × 7 days of contribution data as a grid of colored cells. Each cell's color intensity reflects the activity count for that day (0, 1–3, 4–6, 7–9, 10+). Hovering a cell shows a tooltip with the exact date and count. Users can navigate between years. The heatmap is SVG-based.

---

## Expected Behavior

- The heatmap renders a 52-week grid for the selected year.
- Each cell's fill color is one of 5 intensity levels based on the activity count.
- Hovering a cell shows a tooltip: "4 contributions on March 12, 2024."
- Forward/back arrows navigate between years. The current year's last week may be partial.
- A legend at the bottom shows the 5 color levels.
- Loading state shows a skeleton version of the grid.
- Clicking a cell (optional) navigates to the activity log for that day.

---

## Required React Concepts

- `useState` — selected year, hovered cell `{ date, count }`, tooltip position
- `useEffect` — fetch heatmap data when year changes
- `useMemo` — build the 52×7 grid data structure from the flat `[{ date, count }]` API response; pad missing days; derive intensity level per cell
- `useRef` — SVG container ref for tooltip boundary detection
- `useCallback` — memoize cell mouse enter/leave handlers

---

## Constraints

- The grid must be SVG — not Canvas, not div-grid.
- Grid building (flat array → 52×7 matrix) must be in `useMemo`.
- Tooltip must be positioned relative to the hovered cell and must stay within the SVG viewport bounds.
- Intensity levels must be derived from a configurable thresholds prop (not hardcoded).

---

## Edge Cases to Consider

- Current year's last week is incomplete — render partial weeks correctly without blank cells at the wrong position.
- The year starts on a Wednesday — the first column should be offset with empty cells for Mon/Tue.
- A date has `count: 0` — render the cell with the lowest intensity (not missing/blank).
- Leap year — February must have 29 days.
- Data for some dates is missing from the API response — treat missing dates as 0 count.
- Year with all 0 contributions — all cells show the minimum intensity color; do not crash on "max = 0" division.
- SVG width must be responsive — must not overflow its container on mobile.
