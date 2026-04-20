# 94 — Stale Data Indicator and Background Refresh

## Problem Statement

You are building a stale data indicator system for a real-time financial dashboard. Data on the page has a known freshness SLA — stock prices should be no older than 10 seconds, portfolio values no older than 60 seconds. Each widget displays a freshness indicator. If data becomes stale, the widget is visually marked and a background refresh is triggered automatically.

---

## Expected Behavior

- Each data widget displays a "Last updated X seconds ago" counter that ticks every second.
- If the data age exceeds the widget's staleness threshold, a yellow "Stale" badge appears.
- When data becomes stale, a background re-fetch is triggered automatically.
- While re-fetching, the widget shows a subtle "Refreshing…" overlay (does not block interaction).
- On successful re-fetch, the timestamp resets and the stale badge disappears.
- A global "All data is fresh" / "X widgets have stale data" status bar appears at the top.

---

## Required React Concepts

- `useState` — last-fetched timestamp, current data, is-refreshing flag
- `useEffect` — 1-second ticker to compute age; trigger refresh when age exceeds threshold
- `useRef` — ticker interval ID; last-fetched timestamp (also in ref for accuracy)
- `useMemo` — derive age in seconds from last-fetched timestamp; derive isStale from age vs. threshold
- `useCallback` — memoize the refresh function
- Custom hook (`useFreshData`) — accept `fetchFn` and `staleAfterSeconds`; return `{ data, age, isStale, isRefreshing, forceRefresh }`

---

## Constraints

- Age calculation must use the timestamp stored in `useRef` — not re-computed from state on every render.
- The 1-second ticker must be a single `setInterval` per widget, not nested `setTimeout` calls.
- Background refresh must not block the current data from displaying.
- Multiple widgets must each manage their own refresh cycle independently.

---

## Edge Cases to Consider

- Refresh fires and the API returns the same data as before — timestamp must still reset (data is "fresh" even if unchanged).
- Refresh fails — keep showing the stale data with the stale badge; do not show an error unless refresh fails 3 times consecutively.
- Widget unmounts while a refresh is in-flight — must not setState on the unmounted component.
- Threshold is 0 — data is always stale; refresh triggers immediately and repeatedly (document that 0 is not a valid threshold).
- User manually calls `forceRefresh` while an auto-refresh is already in-flight — must not fire a duplicate request.
- Tab goes background — pause the 1-second ticker (via `document.visibilitychange`) to save resources.
