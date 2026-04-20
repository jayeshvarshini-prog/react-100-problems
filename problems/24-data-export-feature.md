# 24 — Data Export Feature (CSV / JSON)

## Problem Statement

You are building the data export feature for a reporting dashboard. Users can select a date range, choose columns to include, pick a format (CSV or JSON), and then export the data. For large datasets, the export is generated server-side and downloaded as a file when ready. A progress indicator shows the status of server-side export jobs. The user can navigate away and return; in-progress exports are still tracked.

---

## Expected Behavior

- An "Export" button opens an export configuration panel (date range, column selector, format selector).
- Clicking "Generate Export" sends a POST to the export API, which returns a job ID.
- While the job runs, a progress bar and status message are shown ("Preparing export... 64%").
- Progress is polled from `/api/export/:jobId/status` every 2 seconds.
- When the job status is "complete", the UI shows a download button with the file URL.
- If the user navigates away, the export status is saved. On return, polling resumes if the job is not done.
- On error, the panel shows the server error message and a "Try Again" button.

---

## Required React Concepts

- `useState` — panel open state, form values, job ID, job status, progress, download URL
- `useEffect` — start polling when job ID is set; stop polling when status is complete/failed or component unmounts
- `useRef` — store the polling interval ID to clear it on completion or unmount
- `useCallback` — memoize form submit handler and retry handler
- `useMemo` — derive whether the form is valid/ready to submit
- Custom hook (`useExportJob`) — accept `jobId`; return `{ status, progress, downloadUrl, error }` with built-in polling

---

## Constraints

- Polling must use `setInterval` managed via `useRef`, not `setTimeout` recursion.
- Polling must stop immediately when the component unmounts — no state updates after unmount.
- Job ID must be persisted to `sessionStorage` so polling can resume after navigation.
- Column selection must use a controlled multi-select (no external library).

---

## Edge Cases to Consider

- User clicks "Generate Export" twice quickly — must not create two jobs (disable button on first click).
- Job completes between two polls — the final status poll must detect "complete" correctly.
- Export file is very large — progress stuck at 99% for a long time; show "Finalizing..." message.
- User clears sessionStorage manually — must handle missing jobId gracefully on return.
- API returns `status: "failed"` — stop polling, show error.
- Download URL expires (S3 pre-signed URL, 15min TTL) — if user tries to download after expiry, show an error and allow re-export.
