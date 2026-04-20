# 16 — Optimistic UI Updates for a Like/Reaction System

## Problem Statement

You are building the reaction system for a social feed in a community SaaS platform. Each post has a like button with a count. When a user clicks like, the UI must update immediately (optimistically) without waiting for the server response. If the server returns an error, the UI must revert to its pre-click state and show a toast. The solution must handle rapid clicking (debounce or toggle guard), multiple posts on the page simultaneously, and must not allow the count to drift from the server-confirmed value.

---

## Expected Behavior

- Clicking the like button immediately toggles the liked state and increments/decrements the count.
- The API call fires in the background.
- If the API call succeeds, the server-confirmed count replaces the optimistic count.
- If the API call fails, the liked state and count revert to pre-click values, and an error toast appears.
- While a like request is in-flight, the button is disabled to prevent double-submission.
- Multiple posts on the page each manage their own optimistic state independently.
- After server confirmation, the count shown is the server's authoritative value (not derived from toggles alone).

---

## Required React Concepts

- `useState` — per-post liked state, count, and pending state
- `useCallback` — memoize the like handler per post to prevent re-renders of sibling posts
- `useRef` — store the pre-click state snapshot for revert on error
- Custom hook (`useOptimisticLike`) — accept `{ isLiked, count, postId }` and `onToggle` API function; return `{ displayLiked, displayCount, handleLike, isPending }`
- `useMemo` — derive displayable count from optimistic state

---

## Constraints

- Each post's like state must be independent — an error on post A must not affect post B.
- The button must be disabled while a request is in-flight (no double-click race conditions).
- The revert must restore the exact pre-mutation state, not just toggle back.
- The custom hook must be reusable for any "toggleable count" resource, not just likes.

---

## Edge Cases to Consider

- User likes and immediately unlikes before the first request resolves — must serialize correctly.
- Server returns a different count than the optimistic one (e.g., another user also liked) — use server count.
- Component unmounts while the API call is in-flight — must not call setState.
- Network is offline — catch the error and revert; do not leave the button disabled indefinitely.
- Rapid clicks despite the disabled state (button enabled due to state race) — idempotent guard.
- Server returns 409 Conflict (already liked) — revert and show appropriate message.
