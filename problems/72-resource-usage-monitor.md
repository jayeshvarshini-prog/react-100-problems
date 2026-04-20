# 72 — Resource Usage Monitor (CPU / Memory / Disk)

## Problem Statement

You are building the resource usage monitor panel for a cloud infrastructure dashboard. The panel displays live CPU, memory, and disk usage for a selected server. Metrics are streamed via Server-Sent Events (SSE). Each metric is displayed as a percentage gauge and a sparkline chart of the last 60 seconds. Alerts fire when any metric exceeds configurable thresholds (80% warning, 95% critical).

---

## Expected Behavior

- On mount with a server ID, an SSE connection is opened to `/api/servers/:id/metrics/stream`.
- Incoming metric events update the gauge and prepend to the sparkline data (max 60 data points).
- CPU, memory, and disk each have their own gauge (0–100% arc).
- Color changes: green < 80%, yellow ≥ 80%, red ≥ 95%.
- An alert banner appears when any metric crosses a threshold. It persists until the metric drops below the threshold.
- A "Disconnect / Connect" button manually controls the SSE connection.
- The sparkline chart is drawn on a `<canvas>` element.

---

## Required React Concepts

- `useState` — current metrics `{ cpu, memory, disk }`, alert state, SSE connection state
- `useEffect` — open EventSource on mount; listen for message events; close on unmount or server ID change
- `useRef` — EventSource instance; sparkline data arrays for each metric (fixed-size circular buffers); canvas refs
- `useMemo` — derive alert states from current metrics and thresholds; derive gauge color from value
- `useCallback` — memoize the SSE message handler; memoize connect/disconnect toggle
- Custom hook (`useMetricsStream`) — accept server ID and thresholds; return `{ metrics, sparklines, alerts, isConnected, toggle }`

---

## Constraints

- Sparkline data must be stored in `useRef` (not state) to avoid re-rendering the gauge on every data point — only redraw the canvas directly.
- Circular buffer (max 60 entries) must be managed in `useRef` without creating a new array on each update.
- SSE connection must be closed and reopened when the server ID prop changes.
- No external charting library — sparkline is a custom `<canvas>` drawing.

---

## Edge Cases to Consider

- SSE connection drops unexpectedly — EventSource auto-reconnects by default; handle the reconnect event to show a "Reconnecting…" status.
- Server ID changes while the SSE stream is active — must close the old EventSource before opening the new one.
- Metric value is exactly 80% — shows yellow (warning), not green.
- Disconnect button pressed while reconnecting — must stop the reconnect attempts.
- SSE stream sends a malformed event — parse safely; do not crash or corrupt sparkline data.
- Monitor component unmounts while the EventSource is reconnecting — must close cleanly.
