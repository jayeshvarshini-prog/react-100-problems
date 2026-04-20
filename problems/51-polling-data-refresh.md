# 51 — Polling Data Refresh with Smart Backoff

## Problem Statement

You are building a job status monitor for a data pipeline SaaS. Long-running pipeline jobs are polled for status updates. While a job is running, polling fires every 5 seconds. When the job completes or fails, polling stops. If the page is in the background (not visible), polling slows to every 30 seconds. The component must display a "last updated X seconds ago" counter that ticks every second.

---

## Expected Behavior

- On mount with an active job ID, polling begins at 5-second intervals.
- Each poll response updates the job status, progress bar, and log messages.
- When `status` is "complete" or "failed", polling stops permanently.
- When the tab is hidden (`document.visibilityState === 'hidden'`), the interval switches to 30 seconds.
- When the tab becomes visible again, the interval immediately polls once and switches back to 5 seconds.
- A "Last updated X seconds ago" counter increments every second and resets on each poll.
- A manual "Refresh" button triggers an immediate poll and resets the interval.

---

## Required React Concepts

- `useState` — job data, last-updated timestamp
- `useEffect` — set up and clean up the polling interval; attach visibilitychange listener; set up the 1-second "last updated" counter
- `useRef` — polling interval ID; last-updated counter interval ID; current poll interval duration (to avoid stale closure)
- `useCallback` — memoize the poll function; memoize the visibility change handler
- Custom hook (`usePolling`) — accept `fetchFn`, `interval`, `stopCondition`; manage interval, visibility-aware slowdown, and cleanup

---

## Constraints

- The interval duration must be stored in a `useRef` so that the visibility change handler uses the current value, not a stale closure.
- On visibility change to visible, fire one immediate fetch before resetting the interval.
- All intervals must be cleared on component unmount — even if the stop condition is not yet met.
- The "last updated" counter must not drift — use the actual timestamp of the last poll, not an incrementing counter.

---

## Edge Cases to Consider

- Job status is already "complete" when the component mounts — must not start polling at all.
- Poll fires and returns a network error — do not stop polling; log the error and continue.
- Tab switches visibility rapidly (focus → blur → focus in < 1 second) — must not create multiple intervals.
- Manual "Refresh" pressed while a poll is in-flight — must not trigger a second simultaneous request.
- Job transitions from "running" to "complete" and the poll response is received while the tab is hidden — polling must stop and the UI must update when the tab becomes visible.
