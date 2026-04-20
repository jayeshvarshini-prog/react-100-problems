# 79 — Master-Detail Split View Layout

## Problem Statement

You are building a master-detail layout for an email client UI. The left panel shows a list of emails (master). Clicking an email shows its full content in the right panel (detail). The selected email is highlighted in the list. On mobile (< 768px), the layout switches to a single-panel view: the list is shown by default; selecting an email pushes to the detail view. A back button returns to the list on mobile.

---

## Expected Behavior

- Desktop: both panels visible simultaneously. Selecting an email updates the right panel.
- Mobile: list is the default view. Tapping an email transitions to the detail view (slide animation).
- On mobile, a back button ("← Back to Inbox") appears in the detail view header.
- The selected email ID is reflected in the URL (`/inbox/:emailId`). Direct linking to an email ID shows that email in the detail panel.
- The list panel shows: sender avatar, subject, preview snippet, timestamp, and unread indicator.
- The detail panel shows: full sender info, subject, timestamp, full body content, and a reply button.
- Marking an email as read (by viewing it) fires an API call and updates the unread indicator in the list.

---

## Required React Concepts

- `useState` — selected email ID, emails list, mobile panel view ('list' | 'detail')
- `useEffect` — update mobile panel view when selected email changes; mark-as-read API call on email selection; sync selected email with URL
- `useMemo` — derive selected email object from ID and emails array
- `useRef` — `window.matchMedia` instance for responsive detection
- `useCallback` — memoize email selection, back navigation, mark-as-read handlers
- Custom hook (`useMasterDetail`) — manage selection state, URL sync, and responsive view mode

---

## Constraints

- URL must reflect the selected email ID. Navigating directly to `/inbox/123` must load email 123.
- Mark-as-read must fire only once per email view — idempotent.
- Responsive breakpoint must use `window.matchMedia`, not CSS media queries in JS.
- No external routing or layout libraries.

---

## Edge Cases to Consider

- URL has an email ID that doesn't exist in the list — show "Email not found" in the detail panel.
- User on desktop resizes browser to mobile width while an email is open — must switch to single-panel detail view without losing the selected email.
- Email list is empty — detail panel shows "Select an email to read" placeholder.
- Mark-as-read API call fails — must not change the unread indicator; retry silently.
- Multiple emails marked as read in rapid succession — fire API calls independently; do not batch.
- Email body contains HTML — render safely with sanitization to avoid XSS.
