# 93 — Cache-First Data Fetcher with TTL and Invalidation

## Problem Statement

You are building a cache-first data fetching layer for a SaaS dashboard. Frequently accessed resources (user profile, workspace config, feature flags) should be served from an in-memory cache on subsequent requests. The cache has a per-resource TTL. Cache entries can be manually invalidated. The system must support cache-while-revalidate: serve the cached value immediately and update it in the background.

---

## Expected Behavior

- First fetch: data is fetched from the API and stored in cache with a TTL.
- Subsequent requests within TTL: data is served from cache instantly (no network call).
- After TTL expires: data is re-fetched. Until the new data arrives, the stale value is shown.
- `stale-while-revalidate` mode: return cached data immediately and fetch fresh data in the background; update when fresh data arrives.
- Manual invalidation: calling `invalidate(cacheKey)` marks the entry as stale, triggering a re-fetch on the next access.
- Cache entries can be prefetched (warmed before they are accessed).

---

## Required React Concepts

- `useContext` — provide the cache store and `invalidate`/`prefetch` functions throughout the app
- `useState` — per-resource loading, error, data, isStale states (within the consumer hook)
- `useEffect` — trigger re-fetch when cache entry is stale or missing
- `useRef` — in-flight fetch promises (to deduplicate concurrent requests for the same key)
- `useMemo` — derive the cache hit/miss status from the cache store state
- Custom hook (`useCachedResource`) — accept `cacheKey`, `fetchFn`, `ttl`, `staleWhileRevalidate`; return `{ data, isLoading, isStale, error, refetch }`

---

## Constraints

- Cache store must be module-level (shared across all hook instances) — not inside a React context value.
- Concurrent requests for the same cache key must share one in-flight fetch promise (deduplication).
- TTL must be stored per-entry with the fetch timestamp.
- The `invalidate` function must be available through context without causing all consumers to re-render.

---

## Edge Cases to Consider

- Two components mount simultaneously and both need the same uncached resource — must fire only one API call.
- TTL expires between two renders of the same component — second render must trigger re-fetch.
- `invalidate` called for a key that is not in the cache — must be a no-op.
- Background revalidation returns an error — should the stale data remain? Define the behavior explicitly.
- Cache store grows indefinitely — implement an LRU eviction policy (max 100 entries).
- Stale-while-revalidate: background fetch resolves but component has since unmounted — must not setState.
