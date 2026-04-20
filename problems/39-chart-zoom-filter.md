# 39 — Line Chart with Zoom and Time Filter

## Problem Statement

You are building an interactive revenue chart for an analytics dashboard. The chart displays a time-series line chart of daily revenue. Users can zoom into a time range by dragging on the chart. A range selector below the main chart (minimap) shows the full dataset and lets users drag the visible window. Pre-set time range buttons (7D, 30D, 90D, 1Y, All) instantly change the visible window.

---

## Expected Behavior

- The main chart renders the revenue line for the visible time window.
- Dragging on the chart selects a zoom region, and on mouseup, the main chart zooms into that region.
- The minimap below always shows the full dataset with a shaded overlay representing the current visible window.
- Dragging the shaded overlay in the minimap pans the main chart.
- Dragging the edges of the shaded overlay resizes the visible window.
- Pre-set buttons (7D, 30D, etc.) snap the visible window to that duration ending at the latest data point.
- A "Reset Zoom" button returns to the full view.
- Hovering the main chart shows a tooltip with the exact date and value.

---

## Required React Concepts

- `useState` — visibleRange `{ startIndex, endIndex }`, drag state, tooltip state
- `useEffect` — draw on canvas on every render; clear canvas on cleanup
- `useRef` — main chart canvas; minimap canvas; drag start position
- `useMemo` — derive the pixel-to-data-point scale; derive the data slice for the visible window; derive minimap overlay position/width
- `useCallback` — memoize canvas mouse event handlers (mousedown, mousemove, mouseup)
- Custom hook (`useChartDrag`) — manage drag state and return start/current/end coordinates

---

## Constraints

- Chart must be drawn on an HTML5 `<canvas>` element — no SVG or charting library.
- Must use `devicePixelRatio` for sharp rendering on retina/HiDPI displays.
- Mouse event coordinates must be translated to canvas coordinates accounting for canvas offset and pixel ratio.
- Zoom selection must require a minimum drag distance (10px) to avoid accidental single-click zooms.

---

## Edge Cases to Consider

- Dataset has only 1 data point — chart must not crash; render a single dot.
- User drags from right to left — treat as a valid selection (min/max the drag bounds).
- "7D" button selected but only 3 days of data exist — show all 3 days.
- Zoom in to a single day — minimap overlay becomes very narrow; must still be draggable.
- Window resize — canvas dimensions must update and chart must re-render.
- All revenue values are 0 — y-axis must not be all-zero range; show 0–100 default scale.
- Tooltip must not overflow the canvas edges (flip to the left when near the right edge).
