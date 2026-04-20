# 44 — Calendar Event Scheduler

## Problem Statement

You are building a weekly calendar view for a scheduling SaaS. The calendar displays 7 days in a grid with hourly time slots. Existing events are fetched from the API and placed on the grid. Users can create new events by clicking and dragging across time slots. Clicking an existing event opens an edit modal. Events can overlap; overlapping events are displayed side-by-side with reduced width. The calendar navigates forward/backward by week.

---

## Expected Behavior

- The calendar renders a 7-day × 24-hour grid.
- Existing events are loaded on mount for the current week.
- Clicking and dragging on an empty slot creates a new event draft (shown as a ghost element). Releasing the mouse opens a creation modal with the start/end time pre-filled.
- Events are positioned absolutely, height proportional to duration, top position proportional to start time.
- Overlapping events are laid out side-by-side within their column.
- Clicking an event opens an edit/delete modal.
- Prev/Next week buttons fetch and display the adjacent week's events.
- Current time is shown as a red horizontal line at the correct position in today's column.

---

## Required React Concepts

- `useState` — current week start date, events array, drag state `{ dayIndex, startHour, endHour }`, modal state
- `useEffect` — fetch events when week changes; update current-time line every minute
- `useRef` — drag start slot ref; grid container ref for coordinate calculations; current-time interval ID
- `useMemo` — derive event layout (position, width, left offset for overlapping events) from the events array; derive grid column widths
- `useCallback` — memoize mouse event handlers for drag creation
- Custom hook (`useEventLayout`) — compute overlapping event groups and assign each event a column slot

---

## Constraints

- Events must be positioned using CSS absolute positioning within each day column.
- Overlap detection must be purely derived from event start/end times (no manual overlap flags stored).
- The drag-to-create must snap to 15-minute increments.
- No external calendar libraries.

---

## Edge Cases to Consider

- Event starts in one week and ends in the next — show only the portion within the current week.
- Event with 0-minute duration (start equals end) — must not render or must show a minimum height.
- 10+ events on one day all overlapping — must not overflow the column width.
- User drags upward (endHour < startHour) — swap start and end.
- Timezone differences between user and server — all times must display in the user's local timezone.
- Event creation modal dismissed without saving — the ghost event must disappear.
