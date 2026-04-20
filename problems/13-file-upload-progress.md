# 13 — File Upload Manager with Progress Tracking

## Problem Statement

You are building a file upload component for a document management SaaS. Users can select multiple files (or drag and drop them onto an upload zone). Each file is uploaded independently to a pre-signed S3 URL (simulated). Each file shows its own upload progress bar, status (queued, uploading, complete, error), and a cancel button. There is a global concurrency limit: at most 3 files upload simultaneously. Completed uploads are listed with a download link.

---

## Expected Behavior

- Users can drag files onto the drop zone or click to open the file picker (accept PDF, DOCX, PNG, JPEG).
- Each selected file is added to an upload queue with status "queued".
- Up to 3 files upload simultaneously; remaining files are "queued" until a slot opens.
- Each uploading file shows a progress bar (0–100%) updated via XHR `progress` events.
- Clicking "Cancel" on an in-progress upload aborts it via `XMLHttpRequest.abort()`.
- On completion, the file row shows a green checkmark and a link to the uploaded file.
- On error, the row shows an error message and a "Retry" button.
- File type and size (max 10MB) validation occurs before upload begins.

---

## Required React Concepts

- `useReducer` — manage the upload queue: `{ id, file, status, progress, url, error }` per file
- `useEffect` — watch the queue; start uploads when a slot opens; clean up XHR on unmount
- `useRef` — store XHR instances per file ID for cancel/abort
- `useState` — drag-over highlight state
- `useCallback` — memoize drag event handlers, file selection handler
- `useMemo` — derive active upload count and queued files from queue state

---

## Constraints

- No external file upload libraries (no Uppy, Dropzone, etc.).
- Use `XMLHttpRequest` (not `fetch`) for upload in order to access progress events.
- Concurrency limit must be enforced by the queue logic, not by uploading all at once.
- File validation (type, size) must happen synchronously before any network call.

---

## Edge Cases to Consider

- User drops a folder instead of a file — must reject gracefully.
- Same file dropped twice — should create separate upload entries (files are independent).
- File size is exactly 10MB — must be accepted; 10MB + 1 byte must be rejected.
- All 3 slots occupied and user adds 10 more files — all 10 queue up correctly.
- User cancels a file that hasn't started yet (queued) — remove it from the queue, free no slot.
- XHR `progress` event fires with `total === 0` — handle division-by-zero gracefully.
- Network disconnects mid-upload — XHR fires an error event; show retry.
