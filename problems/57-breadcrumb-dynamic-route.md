# 57 — Breadcrumb with Dynamic Route Resolution

## Problem Statement

You are building a dynamic breadcrumb component for a SaaS admin panel with deep nested routes (e.g., `/workspaces/:workspaceId/projects/:projectId/tasks/:taskId`). The breadcrumb must display human-readable names (e.g., "Acme Corp → Marketing Website → Write Blog Post") not raw IDs. Names for dynamic segments are resolved from an API or from already-loaded route data. While a name is loading, a skeleton placeholder is shown for that segment.

---

## Expected Behavior

- The breadcrumb reads the current URL path and parses it into segments.
- Static segments (e.g., "projects", "tasks") are mapped to human-readable labels from a config.
- Dynamic segments (e.g., `:workspaceId` = "abc123") are resolved to names by fetching from an API or from a shared cache.
- While a name is being fetched, that segment renders a skeleton/loading placeholder.
- Once resolved, the name replaces the placeholder.
- Resolved names are cached to avoid re-fetching when navigating back.
- Each breadcrumb segment (except the last) is a clickable link.

---

## Required React Concepts

- `useState` — resolved names map `{ [segmentId]: string | null }`, loading states per segment
- `useEffect` — trigger name resolution for each dynamic segment when the path changes
- `useRef` — module-level or ref-based cache for resolved names (persists across renders)
- `useMemo` — parse the current path into typed segments (static, dynamic) from the route config
- `useCallback` — memoize the resolution trigger function
- Custom hook (`useBreadcrumb`) — accept route config; return parsed and resolved breadcrumb items

---

## Constraints

- Resolution must be parallel (all dynamic segments resolve simultaneously, not sequentially).
- Cache must be a module-level Map (persists across component mounts/unmounts).
- Must support routes where the same resource type appears at different levels (e.g., nested workspaces).
- No router library dependency — must work with a generic `currentPath` string prop.

---

## Edge Cases to Consider

- Path has 6 dynamic segments — all 6 fetch simultaneously; some may resolve before others.
- A resolved name is an empty string — show the raw ID as fallback.
- Name resolution API returns 404 (resource deleted) — show "[Deleted]" or the raw ID.
- Cache hit for some segments, miss for others — mixed loading/resolved state renders correctly.
- User navigates to a completely different path — cache remains valid for reused segments; new segments resolve fresh.
- Breadcrumb segment label is very long — must truncate with ellipsis.
