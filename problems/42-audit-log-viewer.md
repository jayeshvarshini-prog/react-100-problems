# 42 — Audit Log Viewer

## Problem Statement

You are building an audit log viewer for a compliance-focused SaaS platform. The log displays user actions (create, update, delete, login, export) across all resources. The list is paginated with server-side pagination. Users can filter by actor (user), action type, resource type, date range, and search by resource ID. Each log entry can be expanded to show a JSON diff of what changed. Log entries are read-only — no mutations.

---

## Expected Behavior

- On mount, the most recent audit log entries are fetched and displayed.
- A filter panel allows filtering by actor, action type, resource type, and date range.
- A search input filters by resource ID (debounced, server-side).
- Each row shows: timestamp, actor, action, resource type, resource ID, and IP address.
- Clicking a row expands it to reveal a before/after JSON diff of the changed fields.
- Pagination controls navigate through results. Page size selector (25/50/100).
- All active filters are shown as dismissible chips above the table.
- "Export to CSV" exports the current filtered result set.

---

## Required React Concepts

- `useState` — filters object, search query, pagination state, expanded row ID
- `useEffect` — fetch logs when filters or pagination change; debounce search query
- `useRef` — debounce timer for search
- `useMemo` — derive active filter chips from the filters object; derive whether any filters are active
- `useCallback` — memoize filter change, chip dismiss, row expand handlers
- Custom hook (`useAuditLogs`) — encapsulate fetch, pagination, and filter logic

---

## Constraints

- All filtering and searching is server-side — no client-side filtering of loaded data.
- URL must reflect current filter and pagination state (shareable links).
- The JSON diff display must highlight added fields in green and removed fields in red.
- Log entries must never be editable — all inputs in filters only.

---

## Edge Cases to Consider

- Search query contains special regex characters — must be escaped before sending to the API.
- Filter by actor returns an actor who has since been deleted — show their ID with a "(deleted)" tag.
- Date range filter with start after end — validate and show an error.
- Expanding a row with an empty diff (e.g., a login event has no resource changes) — show "No field changes."
- 0 results for the active filters — show "No audit logs match your filters" with a "Clear filters" button.
- Very large JSON diff (100+ fields changed) — show a scrollable container, not a page-height expansion.
