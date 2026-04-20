# 83 — Priority Queue Manager for Background Tasks

## Problem Statement

You are building a client-side priority queue manager for a SaaS dashboard that fires many background API mutations. Tasks are queued with a priority (1–5, 1 = highest). The queue processes tasks one at a time for each priority level, highest priority first. When a task fails, it is retried up to 2 times. The queue's state (pending, active, completed, failed tasks) is displayed in a developer panel.

---

## Expected Behavior

- Tasks can be enqueued from any component using an `enqueue(task)` function from context.
- The queue runs the highest-priority pending task. If two tasks have the same priority, FIFO order.
- Only one task runs at a time (serial processing).
- A failed task is retried up to 2 times. After 2 retries, it moves to the "failed" list.
- The developer panel shows: active task, pending tasks (sorted by priority), completed (last 10), failed tasks.
- A "Clear Failed" button removes all failed tasks from the list.
- Task IDs are unique (auto-generated UUIDs or incrementing integers).

---

## Required React Concepts

- `useReducer` — queue state: `{ pending, active, completed, failed }` with ENQUEUE, START_TASK, COMPLETE_TASK, FAIL_TASK, RETRY_TASK, CLEAR_FAILED actions
- `useEffect` — watch the pending queue; when no task is active, start the highest-priority pending task
- `useContext` — provide `enqueue` function to the entire app
- `useRef` — the current active task's promise/AbortController; retry count per task
- `useMemo` — derive sorted pending list (by priority, then FIFO); derive task counts per status

---

## Constraints

- Priority sorting must happen in `useMemo` — the queue state stores tasks in insertion order.
- Retry logic: on failure, re-enqueue with retry count incremented; stop at retry count 2.
- The queue must process the next task only after the previous task's promise resolves or rejects — no parallel execution.
- `enqueue` must be a stable function reference (via `useCallback`) so calling it from `useEffect` dependencies works correctly.

---

## Edge Cases to Consider

- Two tasks with the same priority enqueued simultaneously — FIFO order must be maintained.
- Queue is empty and a new task is enqueued — it must start immediately, not wait for the next `useEffect` cycle.
- Task's promise never resolves (hangs) — must not block the queue forever; implement a timeout (30s).
- "Clear Failed" called while a task is being retried — must not affect the active retry.
- Component providing the queue unmounts — pending tasks are lost (document this limitation).
- 100 tasks enqueued at once — must not cause 100 simultaneous re-renders.
