# 69 — Document Upload Manager with Virus Scan Status

## Problem Statement

You are building the document management system for a legal tech SaaS. Users upload documents that go through an asynchronous virus scan before becoming available. The upload flow: (1) User selects file → (2) File uploads to the server → (3) Virus scan runs (async, polled) → (4) Document is available or rejected. Each document in the list shows its current lifecycle status. Rejected documents show a rejection reason.

---

## Expected Behavior

- Users upload documents (PDF, DOCX — max 25MB) via a drop zone.
- After upload, the document appears in the list with status "Scanning".
- Status is polled every 3 seconds until it changes from "scanning" to "available" or "rejected".
- "Available" documents show a download link and file metadata (name, size, type, uploaded date).
- "Rejected" documents show a red badge, the rejection reason (e.g., "Virus detected"), and a "Remove" button.
- Multiple documents can be in different lifecycle stages simultaneously.
- Upload queue allows uploading while previous documents are still scanning.

---

## Required React Concepts

- `useReducer` — manage documents list with ADD_DOCUMENT, UPDATE_STATUS, REMOVE_DOCUMENT actions
- `useEffect` — for each document in "scanning" status, set up a 3-second poll; clean up when status changes or component unmounts
- `useRef` — Map of polling interval IDs keyed by document ID; Map of AbortControllers for uploads
- `useState` — drag-over state
- `useMemo` — derive counts by status (X available, Y scanning, Z rejected)
- `useCallback` — memoize upload handler, remove handler
- Custom hook (`useDocumentPolling`) — accept document ID; return `{ status, downloadUrl, rejectionReason }` with built-in polling

---

## Constraints

- Each document's polling interval must be independent — one document completing scan must not affect others.
- Polling must stop as soon as status is "available" or "rejected" — no continued polling.
- Polling must stop on component unmount even if the scan is still running.
- File validation (type, size) must happen client-side before upload starts.

---

## Edge Cases to Consider

- User uploads 10 documents simultaneously — all 10 poll independently, potentially firing 10 API calls per 3 seconds. Consider a batched status poll endpoint.
- Polling returns an unexpected status value (e.g., "quarantined") — must render gracefully with a fallback label.
- Upload fails mid-transfer (network drop) — document should not appear in the list.
- User removes a "scanning" document — polling interval must be cleared immediately.
- Same file uploaded twice — both uploads must proceed independently (server assigns unique IDs).
- Document scan takes longer than expected (> 5 minutes) — show "Still scanning..." message after 2 minutes of polling.
