# 125 — Optimistic UI Update with Rollback on Error

## Problem Statement

Build a todo list where toggling a todo as complete is applied to the UI immediately (optimistic update), while the PATCH request fires in the background. If the request fails, the toggle must be rolled back to its previous state and an error toast is shown. The user should never have to wait for the server to see their action reflected.

---

## Expected Behavior

- User clicks the checkbox on a todo.
- The checkbox toggles immediately in the UI (optimistic).
- A PATCH request fires in the background.
- If the request succeeds: nothing changes visually (UI is already correct).
- If the request fails: the checkbox reverts to its original state.
- A brief error message ("Failed to update, change reverted") appears for 3 seconds.
- Other todos remain fully interactive during the failing request.

---

## Required Concepts

- Snapshot the previous state before applying the optimistic update
- `try/catch` — in the catch, restore the snapshot
- `useState` — todos array (replacing a single item in an immutable way)
- The "find and replace by id" pattern for updating one item in an array

---

## Constraints

- The optimistic update must be applied before `await` — never after.
- The rollback must restore exactly the item that was changed, not the entire list from the server.
- Do not refetch the full list on error — just restore the snapshot.

---

## Edge Cases to Consider

- User toggles the same todo twice quickly before the first request resolves — what is the correct final state?
- User toggles todo A and todo B simultaneously — rollback of A must not affect B.
- What if the network is slow and the user navigates away — unmount during in-flight PATCH.
