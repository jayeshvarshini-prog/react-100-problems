# 127 — Polling an API Until a Condition is Met

## Problem Statement

Build a job status tracker. After the user clicks "Start Job", a POST request fires to kick off a background job and returns a `jobId`. Then poll `GET /jobs/{jobId}` every 2 seconds until the status is `"completed"` or `"failed"`. Display live status updates. Stop polling when done. Allow the user to manually cancel the job at any time.

---

## Expected Behavior

- User clicks "Start Job" → POST fires → `jobId` returned.
- Polling begins: every 2 seconds, GET the job status.
- Status values cycle through: `"queued"` → `"running"` → `"completed"` or `"failed"`.
- UI shows the current status live.
- When status is `"completed"` or `"failed"`, polling stops automatically.
- User can click "Cancel" at any time — polling stops and a cancellation message is shown.
- If any poll request fails (network error), show an error and stop polling (do not continue polling on error).

---

## Required Concepts

- `setInterval` inside `useEffect` with cleanup (`clearInterval`)
- OR recursive `setTimeout` pattern (preferred — avoids overlapping calls)
- `useRef` — hold the timeout/interval ID so it can be cancelled imperatively
- `async/await` inside the poll callback with `try/catch`
- Stopping condition inside the poll: check status before scheduling next tick

---

## Constraints

- Do not use `setInterval` if using the recursive approach — pick one and understand why recursive `setTimeout` is safer for async operations.
- Polling must stop immediately on cancel, not after the current interval fires.
- A failed network request during polling must stop the poll — do not silently continue.

---

## Edge Cases to Consider

- What if the job completes between two polls — is the final status always shown?
- What if two "Start Job" clicks happen quickly — are two pollers running simultaneously?
- Component unmounts while polling — does the interval get cleaned up?
