# 25 — Nested Comments and Replies System

## Problem Statement

You are building the comments feature for a project management tool. Comments can be nested up to 3 levels deep (comment → reply → reply to reply). Users can post new top-level comments, reply to any comment, edit their own comments, and delete them. Deleted comments show a "[deleted]" tombstone if they have replies. Real-time updates: new comments from other users appear without page refresh (via polling every 30s).

---

## Expected Behavior

- Top-level comments are listed chronologically, newest at the bottom.
- Each comment has a "Reply" button that opens an inline reply input beneath it.
- Reply input auto-focuses when opened. Pressing Escape closes it without submitting.
- Submitting a reply adds it optimistically, then confirms with the API response.
- Users can edit their own comments inline (click Edit → textarea replaces text → Save/Cancel).
- Deleting a comment with no replies removes it entirely. Deleting one with replies shows "[deleted]".
- Comments are polled every 30s. New comments from others are appended without disrupting the current user's scroll position.

---

## Required React Concepts

- `useReducer` — manage comment tree state: ADD_COMMENT, ADD_REPLY, EDIT_COMMENT, DELETE_COMMENT, LOAD_COMMENTS
- `useState` — per-comment UI state: reply input open, edit mode active (kept in a Map or per-component)
- `useEffect` — set up 30s polling interval; clean up on unmount
- `useRef` — store polling interval ID; ref to new comment textarea for auto-focus
- `useMemo` — build the nested comment tree from a flat API response `[{ id, parentId, ... }]`
- `useCallback` — memoize submit, edit, delete handlers per comment

---

## Constraints

- Comments are stored as a flat array in state and rendered as a nested tree (derived with `useMemo`).
- Polling must not reset the scroll position or cause visible re-renders for unchanged comments.
- Only the comment author can see Edit/Delete buttons (check against current user ID from auth context).
- Reply nesting is capped at level 3 — the Reply button must not appear on level-3 comments.

---

## Edge Cases to Consider

- Polling returns new comments while the user is typing a reply — must not discard the draft.
- Optimistic reply fails — remove the optimistic comment, restore the reply input with the text.
- User edits a comment while a poll completes — the poll response must not overwrite the in-progress edit.
- Two users delete the same comment simultaneously — second delete gets a 404; handle gracefully.
- Comment tree has 500+ comments — performance must not degrade (virtualize if needed).
- Markdown in comment text — render safely (escape HTML to avoid XSS).
