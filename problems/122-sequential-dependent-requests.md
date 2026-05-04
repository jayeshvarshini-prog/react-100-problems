# 122 — Sequential Dependent Requests

## Problem Statement

Build a "user order details" page. To display it, you need three sequential fetches where each depends on the previous: first fetch the logged-in user → use `user.id` to fetch their latest order → use `order.id` to fetch the order's line items. Display a single loading state for the whole chain. If any step fails, show which step failed.

---

## Expected Behavior

- On mount, fetch the user.
- Once user is available, fetch their latest order using `user.id`.
- Once the order is available, fetch line items using `order.id`.
- A single spinner covers the whole chain.
- If the user fetch fails, show "Failed to load user."
- If the order fetch fails, show "Failed to load order."
- If line items fail, show "Failed to load order items."
- On full success, render all three pieces of data together.

---

## Required Concepts

- Sequential `await` — each fetch awaits the previous result
- Granular error messages per step using a `step` variable in the catch block
- `try/catch` wrapping the whole chain vs individual steps (trade-offs)
- `useState` — data for each step, loading, error with step info

---

## Constraints

- Do not use `Promise.all` — these requests are intentionally sequential and dependent.
- The error message must tell the user which step failed, not just "Something went wrong."
- Do not nest `try/catch` blocks — use a single outer `try/catch` with a `currentStep` variable.

---

## Edge Cases to Consider

- What if step 2 succeeds but returns an empty array — does step 3 still run?
- What happens if the component unmounts after step 1 but before step 2 starts?
- How do you avoid calling `setState` after unmount across a 3-step chain?
