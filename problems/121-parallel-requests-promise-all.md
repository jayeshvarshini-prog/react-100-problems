# 121 — Parallel Requests with Promise.all and Promise.allSettled

## Problem Statement

Build a dashboard that loads three independent data sources simultaneously: user profile, recent orders, and notifications. All three must be fetched in parallel (not sequentially). The dashboard renders as soon as all three succeed. You will implement this twice: first with `Promise.all` (fails fast if any request fails), then with `Promise.allSettled` (each section shows its own error independently).

---

## Expected Behavior

**Version A — Promise.all:**
- All three fetches run in parallel.
- If all succeed, the dashboard renders all three sections.
- If any one fails, the entire dashboard shows an error.

**Version B — Promise.allSettled:**
- All three fetches run in parallel.
- Each section independently shows its data or its own error.
- A partial dashboard (some sections loaded, some errored) is valid and expected.

---

## Required Concepts

- `Promise.all([...])` — rejects as soon as any promise rejects
- `Promise.allSettled([...])` — always resolves; each result has `{ status: 'fulfilled' | 'rejected', value | reason }`
- `async/await` with `try/catch`
- Understanding the performance difference vs sequential `await`

---

## Constraints

- Requests must be fired simultaneously, not sequentially. Do not `await` each one before starting the next.
- For `Promise.allSettled`, each section must have its own loading/error/data state derived from the settled result.

---

## Edge Cases to Consider

- What does your loading state look like before `Promise.all` resolves — is the whole dashboard in a loading state?
- With `Promise.allSettled`, what if all three fail?
- How do you type or destructure the results array from `Promise.allSettled`?
