# 107 — TanStack Query — useQuery

## Problem Statement

Build a user list component that fetches data using TanStack Query's `useQuery` hook. Display the loading state, error state, and success state properly. Add a manual "Refetch" button. Demonstrate cache behaviour by showing the timestamp of the last successful fetch — clicking Refetch before `staleTime` expires must NOT trigger a network request (data comes from cache). After `staleTime` expires, refetch goes to the network.

---

## Expected Behavior

- On mount, `useQuery` fetches a list of users (simulate with a 800ms `setTimeout` promise).
- While loading: spinner / "Loading…" text.
- On error: error message with a Retry button.
- On success: render a card per user (name, email, role).
- "Refetch" button calls `refetch()`. While re-fetching, button shows "Fetching…".
- "Last updated" timestamp shown below the button, formatted with `toLocaleTimeString()`.
- `staleTime` set to 10 seconds — describe in a comment why this prevents redundant fetches.

---

## Where to Start — Interview Approach

### Step 1: QueryClient setup
```js
// Create once OUTSIDE the component so it's not re-created on every render
const queryClient = new QueryClient();

// Wrap your component tree
const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserList />
  </QueryClientProvider>
);
```
Since each problem is a standalone component here, wrap the inner component inside the exported default.

### Step 2: useQuery call
```js
const {
  data,
  isLoading,      // true only on first load with no cached data
  isFetching,     // true whenever a background refetch is in progress
  isError,
  error,
  refetch,
  dataUpdatedAt,  // timestamp of last successful fetch
} = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 10_000,   // 10 seconds
});
```

### Step 3: Distinguish isLoading vs isFetching
- `isLoading` = no data yet + fetching → show full-page skeleton.
- `isFetching && !isLoading` = background refresh → show subtle spinner in the button, keep old data visible.

### Step 4: Mock queryFn
```js
const fetchUsers = () =>
  new Promise((resolve) => setTimeout(() => resolve(MOCK_USERS), 800));
```

---

## Required React Concepts / TanStack Query APIs

- `QueryClient` + `QueryClientProvider` — required setup
- `useQuery` — core data-fetching hook
- `queryKey` — unique cache identifier; array form `['users']` allows namespacing
- `queryFn` — async function that returns the data
- `staleTime` — how long cached data is considered fresh (no background refetch)
- `isLoading` vs `isFetching` — critical distinction to display correct UI states
- `refetch` — manually trigger a fetch regardless of stale status
- `dataUpdatedAt` — Unix timestamp of last successful response

---

## Constraints

- `QueryClient` must be created outside the component, not inside (avoids recreating on every render).
- The mock `queryFn` must return a Promise with a simulated delay (no real network call needed).
- Show all three UI states: loading, error, success.
- Wrap the component with `QueryClientProvider` inside the default export.

---

## Edge Cases to Consider

- `refetch` called while already fetching — TanStack Query deduplicates this automatically; mention it.
- Component mounts multiple times (StrictMode double-invocation) — QueryClient caches the result; second mount reads from cache.
- `staleTime: Infinity` — data is never considered stale; useful for static reference data.
- Error state — `retry` option defaults to 3 in TanStack Query; consider setting `retry: false` in this demo so errors surface immediately.
