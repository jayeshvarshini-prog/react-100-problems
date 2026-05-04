# 129 — File Upload with Progress Tracking and Cancel

## Problem Statement

Build a file upload component that uploads a file to a server using Axios, shows real-time upload progress as a percentage bar, and allows the user to cancel the upload mid-way. After cancellation, the UI resets and the user can select a new file. Handle upload errors separately from user-initiated cancellations.

---

## Expected Behavior

- User selects a file with a file input.
- Clicking "Upload" starts the Axios POST with the file in a `FormData` body.
- A progress bar updates in real-time from 0% to 100%.
- A "Cancel" button is visible during upload.
- Clicking Cancel aborts the request, the progress bar disappears, and the UI returns to the initial state.
- On upload success (100%), show "Upload complete!" and the file name.
- On upload error (not cancel), show "Upload failed. Try again."
- Cancelled uploads must NOT show an error.

---

## Required Concepts

- `axios.post(url, formData, { onUploadProgress, signal })` — progress callback
- `onUploadProgress: (e) => setProgress(Math.round(e.loaded / e.total * 100))`
- `AbortController` — create before upload, call `.abort()` on cancel
- `axios.isCancel(error)` — detect cancellation in catch block
- `useState` — file, progress, status ('idle' | 'uploading' | 'success' | 'error' | 'cancelled')

---

## Constraints

- Progress must use Axios's `onUploadProgress` callback — do not fake it with a timer.
- Cancellation must use AbortController, not Axios's deprecated `CancelToken`.
- A cancelled upload must not show an error state.

---

## Edge Cases to Consider

- User selects a file, starts upload, cancels, then selects a new file — does the previous abort controller interfere?
- What if `e.total` is 0 or undefined in `onUploadProgress` — division by zero?
- What if the file is very small and the upload completes before the user can cancel?
