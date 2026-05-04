# 108 — TanStack Query — useMutation + Optimistic Updates

## Problem Statement

Build a user management UI where you can add and delete users. Use TanStack Query's `useMutation` with full optimistic update support: when the user clicks "Add", the new entry appears immediately in the list (greyed out / "saving…") before the server confirms. If the server rejects the request, the optimistic entry must be rolled back and the list restored to its previous state. Deletion must also be optimistic.

---

## Expected Behavior

- List of users fetched with `useQuery`.
- "Add" form (name + email). Submitting immediately appends a greyed-out optimistic entry.
- After 600ms simulated server delay, the optimistic entry is replaced by the real server response.
- Type "error" in the name field to trigger a server rejection — the optimistic entry disappears and the original list is restored.
- Each user has a "Delete" button. Clicking it immediately removes the row; if the delete fails, the row reappears.

---

## Where to Start — Interview Approach

### Step 1: The three mutation lifecycle callbacks
```js
useMutation({
  mutationFn: addUser,
  onMutate: async (newUser) => {
    // 1. Cancel any outgoing refetches (avoid overwriting optimistic update)
    await queryClient.cancelQueries({ queryKey: ['users'] });

    // 2. Snapshot the current value for rollback
    const prev = queryClient.getQueryData(['users']);

    // 3. Optimistically update the cache
    queryClient.setQueryData(['users'], (old) => [...old, { ...newUser, id: 'temp-' + Date.now() }]);

    // 4. Return snapshot as context for onError
    return { prev };
  },
  onError: (_err, _vars, context) => {
    // Rollback to snapshot
    queryClient.setQueryData(['users'], context.prev);
  },
  onSettled: () => {
    // Always refetch to sync with server truth
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

### Step 2: Visual "saving…" state
Give the optimistic entry a temporary id (e.g., `'temp-' + Date.now()`). In the JSX:
```jsx
<div style={{ opacity: String(user.id).startsWith('temp') ? 0.5 : 1 }}>
  {user.name} {String(user.id).startsWith('temp') && <small>(saving…)</small>}
</div>
```

### Step 3: useQueryClient inside the component
```js
const queryClient = useQueryClient(); // gets the QueryClient from context
```

### Step 4: Error simulation
```js
const addUser = ({ name, email }) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (name.toLowerCase().includes('error')) return reject(new Error('Server rejected name'));
      serverDb.push({ id: ++nextId, name, email });
      resolve({ id: nextId, name, email });
    }, 600)
  );
```

---

## Required TanStack Query APIs

- `useMutation` — drives the add and delete operations
- `onMutate` — for optimistic updates + snapshot capture
- `onError` — rollback using the snapshot from `onMutate` context
- `onSettled` — always fires (success or error); ideal for `invalidateQueries`
- `useQueryClient` — access the QueryClient inside a component
- `queryClient.cancelQueries` — prevents race condition between optimistic update and background refetch
- `queryClient.getQueryData` — read current cache value for snapshot
- `queryClient.setQueryData` — write directly to cache (optimistic update + rollback)
- `queryClient.invalidateQueries` — mark data stale and refetch

---

## Constraints

- `onMutate` must `await cancelQueries` before writing to cache.
- The snapshot must be captured before `setQueryData` — not after.
- `onSettled` must always call `invalidateQueries`, even on success, to replace the temp id with the real server id.
- The mock server must live in module scope (not inside the component) so state persists across re-renders.

---

## Edge Cases to Consider

- Two rapid "Add" clicks before first resolves — each `onMutate` runs in sequence; both optimistic entries appear. `onSettled` runs twice.
- Rollback when the list was empty — `context.prev` would be `[]`; rollback correctly restores an empty array.
- Delete of an optimistic entry (temp id) — the delete button should be disabled for temp entries to avoid mutating unconfirmed data.
- Network timeout (mutation takes too long) — add a `timeout` to your mock and handle the rejection path.
