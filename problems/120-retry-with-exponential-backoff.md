# 120 — Retry Logic with Exponential Backoff

## Problem Statement

Build a data fetcher that automatically retries a failed request up to 3 times, with exponential backoff (1s, 2s, 4s delays between retries). Show the user which retry attempt is in progress. After all retries are exhausted, show a final error state with a manual retry button that resets the whole process.

---

## Expected Behavior

- On mount (or manual retry), the fetch begins.
- If it fails, wait 1s, then retry. Show "Retrying... attempt 2 of 3".
- If that fails, wait 2s, retry. Show "Retrying... attempt 3 of 3".
- If all 3 retries fail, show the error and a "Try Again" button.
- On any success (even on retry 3), show the data normally.

---

## Required Concepts

- Recursive or loop-based retry with `async/await`
- `await new Promise(resolve => setTimeout(resolve, delay))` for delay between retries
- `useState` — data, loading, error, retryCount, retryAttempt
- `try/catch` inside a retry loop

---

## Constraints

- Backoff must be exponential: delay = `1000 * 2^(attempt - 1)` ms.
- Do not use an external retry library.
- The retry counter shown in the UI must be live (updates between attempts).
- Manual "Try Again" resets attempt count to 0 and starts fresh.

---

## Edge Cases to Consider

- What if the component unmounts during a retry delay — should the pending `setTimeout` be cancelled?
- What if the request succeeds on attempt 2 — do you correctly stop retrying?
- What happens if you click "Try Again" while a retry is already in progress?
