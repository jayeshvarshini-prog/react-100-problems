# 70 — Timeline Activity Feed with Grouping

## Problem Statement

You are building the activity feed for a project management SaaS. The feed shows a chronological list of events (task created, comment added, status changed, file uploaded, member invited). Events within the same day are grouped under a date heading. Events by the same actor within 10 minutes are grouped into a single feed item ("Alice updated 3 tasks"). The feed supports infinite scroll with a "Load more" button at the bottom.

---

## Expected Behavior

- On mount, the most recent activity events are fetched (newest first).
- Events are grouped by date (today, yesterday, then date strings for older).
- Consecutive events by the same actor within 10 minutes are collapsed into one grouped item showing a summary.
- Expanding a grouped item reveals all individual events within the group.
- A "Load more" button at the bottom fetches the next page of events and appends them.
- Each event shows: actor avatar, action description, resource link, and relative timestamp.
- New events arriving via polling (every 30s) are prepended to the top.

---

## Required React Concepts

- `useState` — events array, page cursor, loading state, expanded groups set
- `useEffect` — fetch events on mount; set up 30s polling for new events
- `useMemo` — derive the grouped and dated feed structure from the flat events array (expensive derivation — memoize)
- `useCallback` — memoize load-more handler, group expand handler, polling fetch handler
- `useRef` — polling interval ID; Set of seen event IDs to deduplicate polling results
- Custom hook (`useActivityFeed`) — manage events state, polling, pagination, deduplication

---

## Constraints

- Event grouping logic must be in `useMemo` — not in render.
- "Load more" must append to the events array, not replace it.
- Polling must deduplicate events (if a polled event is already in the list, it must not be added again).
- Group expansion state must persist when new events arrive at the top.

---

## Edge Cases to Consider

- Polling returns events that belong in the middle of the list (a delayed event) — must insert in chronological order, not prepend blindly.
- An actor makes an event, then their account is deleted — show "[Deleted User]" with a placeholder avatar.
- Two events from different actors at the exact same timestamp — must not be grouped.
- "Load more" returns an empty array — hide the "Load more" button permanently.
- Feed has 0 events — show "No activity yet" empty state.
- Rapidly expanding and collapsing a group while new events arrive — must not cause stale expansion state.
