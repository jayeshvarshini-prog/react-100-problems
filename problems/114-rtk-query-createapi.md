# 114 — RTK Query — createApi

## Problem Statement

Build a component that uses RTK Query's `createApi` to define endpoints and consume auto-generated hooks. Define three endpoints: `getPosts`, `getPost` (by id), and `getUsers`. Clicking a post shows its detail in a side panel fetched by `getPost`. User names are resolved from the `getUsers` result. Demonstrate cache sharing: switching between posts that have already been viewed must be instant (cache hit).

---

## Expected Behavior

- Post list fetched via `useGetPostsQuery()` on mount.
- User names fetched via `useGetUsersQuery()` in parallel — displayed per post row.
- Clicking a post selects it and fetches detail via `useGetPostQuery(id)`.
- Already-viewed posts show instantly (cache hit — no loading state).
- Unviewed posts show a "Loading..." state in the detail panel.
- All fetches use a mock base query (no real network).

---

## Where to Start — Interview Approach

### Step 1: Define the API
```js
import { createApi } from '@reduxjs/toolkit/query/react';

const api = createApi({
  reducerPath: 'api',       // key in the Redux store
  baseQuery:   myBaseQuery, // async fn that performs the actual fetch
  endpoints: (builder) => ({
    getPosts:  builder.query({ query: () => ({ url: '/posts' }) }),
    getPost:   builder.query({ query: (id) => ({ url: `/posts/${id}` }) }),
    getUsers:  builder.query({ query: () => ({ url: '/users' }) }),
  }),
});

export const { useGetPostsQuery, useGetPostQuery, useGetUsersQuery } = api;
```

### Step 2: Wire the store
```js
const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
```
The `api.middleware` is required — it handles cache invalidation, polling, and lifecycle events.

### Step 3: Custom baseQuery (mock, no real network)
```js
const myBaseQuery = () => async ({ url }) => {
  await new Promise((r) => setTimeout(r, 500));
  if (url === '/posts')          return { data: MOCK_POSTS };
  if (url.startsWith('/posts/')) return { data: MOCK_POSTS.find((p) => p.id === Number(url.split('/')[2])) };
  if (url === '/users')          return { data: MOCK_USERS };
  return { error: { status: 404, error: 'Not found' } };
};
```
A real baseQuery uses `fetchBaseQuery({ baseUrl: 'https://api.example.com' })`.

### Step 4: skip option for conditional fetching
```js
const { data: post } = useGetPostQuery(selectedId, {
  skip: !selectedId,   // don't fetch until a post is selected
});
```

### Step 5: Cache hit demo
RTK Query caches by `queryKey` (endpoint name + args). `getPost(1)` is cached after first fetch. Clicking post #1 again → instant render, no network call.

---

## Required RTK Query APIs

- `createApi` — defines the API slice with endpoints
- `reducerPath` — where RTK Query stores its cache in the Redux state tree
- `baseQuery` — the transport layer; can wrap `fetch`, `axios`, or a mock
- `builder.query` — read-only endpoint (GET)
- `builder.mutation` — write endpoint (POST/PUT/DELETE) — not used here but know the distinction
- Auto-generated hooks: `use<EndpointName>Query`, `use<EndpointName>Mutation`
- `skip` option — conditional fetching
- `api.middleware` — must be added to the store middleware chain

---

## Key Interview Points

| Concept | Detail |
|---|---|
| `reducerPath` | RTK Query manages its own slice; must match key in `configureStore` reducer |
| Auto-generated hooks | `createApi` generates `useXxxQuery` and `useXxxMutation` hooks automatically |
| Cache key | `endpoint name + serialized args` — `getPost(1)` and `getPost(2)` are separate cache entries |
| `skip` | Prevents the query from running; useful for dependent queries |
| `api.middleware` | Handles cache lifetime, polling, subscriptions — omitting it breaks the cache |

---

## Constraints

- `api.middleware` must be added to `configureStore`.
- `reducerPath` in `createApi` must match the key used in `configureStore`'s reducer map.
- Use `skip: !selectedId` for the detail query — do not conditionally call hooks.
- Store must be created in module scope, not inside a component.

---

## Edge Cases to Consider

- Calling `useGetPostQuery(undefined)` without `skip` — RTK Query will attempt to call the query with `undefined`; always guard with `skip`.
- Multiple components using the same endpoint — RTK Query deduplicates the request; all subscribers share one cache entry.
- `baseQuery` returning `{ error: ... }` — surfaces as `isError: true` in the hook; handle it in UI.
- Cache invalidation — not demonstrated here, but in production use `providesTags` / `invalidatesTags` to keep list and detail in sync after mutations.
