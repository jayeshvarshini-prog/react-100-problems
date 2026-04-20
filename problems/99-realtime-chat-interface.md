# 99 — Real-Time Chat Interface

## Problem Statement

You are building a real-time chat interface for a SaaS platform's team communication feature. The chat supports multiple channels. Messages are loaded on mount and new messages arrive via WebSocket. Users can send text messages, upload image attachments, and react to messages with emojis. The message list auto-scrolls to the bottom when a new message arrives — unless the user has manually scrolled up.

---

## Expected Behavior

- On mount, the last 50 messages are fetched for the active channel. Scrolling up loads more (paginated).
- New messages from others arrive via WebSocket and are appended to the bottom.
- Sending a message adds it optimistically. On success, the server-assigned ID and timestamp replace the optimistic values.
- The message list auto-scrolls to the latest message unless the user has scrolled up (show a "New messages ↓" button instead).
- Emoji reactions: clicking an emoji on a message adds/removes your reaction. Reaction counts are shown.
- Image uploads: clicking the paperclip opens the file picker. Images are uploaded, then the message is sent with the image URL.
- Typing indicator: if another user is typing (WebSocket event), show "[User] is typing…" at the bottom.

---

## Required React Concepts

- `useReducer` — message state with LOAD_MESSAGES, PREPEND_MESSAGES (load more), APPEND_MESSAGE (new/optimistic), CONFIRM_MESSAGE, TOGGLE_REACTION, SET_TYPING actions
- `useState` — message input value, channel ID, is-at-bottom flag
- `useEffect` — open WebSocket on channel change; close on channel change or unmount; scroll behavior
- `useRef` — WebSocket instance; message list container ref (for scroll position); bottom sentinel ref; scroll-before-append position
- `useMemo` — derive reaction summary per message (emoji → count, did-current-user-react)
- `useCallback` — memoize send, react, scroll, and WebSocket message handler

---

## Constraints

- WebSocket must reconnect automatically with exponential backoff (max 5 retries).
- Auto-scroll must only fire when the user is already near the bottom (within 100px of bottom).
- Optimistic messages must have a temporary ID replaced by the server ID on confirmation.
- File upload must occur before the message is sent — do not send the message until the upload URL is returned.

---

## Edge Cases to Consider

- User sends a message at the exact moment a WebSocket message arrives — must not duplicate or drop either.
- Optimistic message fails (API error) — must be visually marked as failed with a "Retry" option.
- Load more (scroll up) fetches messages that include the already-loaded ones (overlap) — deduplicate by message ID.
- Typing indicator arrives for user who then sends a message — typing indicator must disappear on the send event.
- Channel switch while a message send is in-flight — the send still completes but the response applies to the old channel (handle or discard).
- Very long message (10,000 chars) — must render without breaking the layout.
