# 06 — Analytics Dashboard with Multiple Data Widgets

## Problem Statement

You are building the main analytics dashboard for a SaaS platform. The dashboard displays 6 independent metric widgets: Total Revenue, Active Users, Churn Rate, New Signups, Average Session Duration, and Top Pages. Each widget fetches its own data from a separate API endpoint. Widgets load independently so a slow widget does not block others. Each widget has its own loading skeleton and error state with a retry button. A global date-range filter at the top of the dashboard re-fetches all widgets when changed.

---

## Expected Behavior

- On mount, all 6 widgets begin fetching their data in parallel.
- Each widget renders a loading skeleton while its data is pending.
- If a widget's fetch fails, it shows an error card with a "Retry" button that re-fetches only that widget.
- Successfully loaded widgets render their metric value with a trend indicator (up/down arrow + percentage change vs. previous period).
- Changing the date range at the top invalidates all widget data and triggers re-fetches.
- A "Refresh All" button re-fetches all widgets simultaneously.
- Each widget displays a "Last updated" timestamp.

---

## Required React Concepts

- `useState` — per-widget loading, error, and data state; global date range
- `useEffect` — trigger each widget's fetch when date range changes
- `useCallback` — memoize per-widget retry handlers
- `useMemo` — derive trend percentage from current and previous period values
- Custom hook (`useWidgetData`) — encapsulate fetch logic, loading, error, retry, and last-updated state for a given endpoint and date range
- `useReducer` — optionally manage per-widget state (loading/error/data) as a single reducer per widget

---

## Constraints

- Each widget must be a self-contained component that manages its own data fetching.
- Use `Promise.allSettled` (not `Promise.all`) for the "Refresh All" path so one failure does not cancel others.
- No global state library. Widget state is local to each widget or managed via the custom hook.
- Date range must be passed as a prop/context, not hardcoded.

---

## Edge Cases to Consider

- All 6 widgets fail simultaneously (network offline) — each shows its own error state.
- Date range changed while one widget is still loading — the in-flight request must be cancelled.
- Widget data returns null or undefined for a metric — show "N/A" without crashing.
- Rapid date range changes — only the final selection should trigger fetches (debounce the date range).
- Retry of one widget while "Refresh All" is also in progress — must not double-fetch.
- Widget receives a negative trend value — render correctly with a down arrow and red color.
