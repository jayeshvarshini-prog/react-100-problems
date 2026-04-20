# 37 — Tag Input Component

## Problem Statement

You are building a reusable tag input component for use in issue trackers, CMS content tagging, and email recipient fields. Users type text and press Enter or comma to create a tag. Tags are displayed as removable chips inside the input. The component supports optional autocomplete suggestions from an async source. Tags can have a maximum count limit. Duplicate tags must be prevented.

---

## Expected Behavior

- User types in the input field. Pressing Enter or comma creates a tag from the current text.
- Created tags appear as chips to the left of the input cursor within the same input container.
- Each chip has an X button to remove it.
- Pressing Backspace when the input is empty removes the last tag.
- If an `asyncSuggest` prop is provided, typing shows matching suggestions in a dropdown.
- Clicking a suggestion adds it as a tag and clears the input.
- Duplicate tags (case-insensitive) are prevented — attempting to add a duplicate shakes the existing tag.
- A `maxTags` prop prevents adding more tags when the limit is reached.

---

## Required React Concepts

- `useState` — tags array, input value, suggestions, loading state
- `useEffect` — debounce and call `asyncSuggest` when input changes
- `useRef` — reference to the inner input element (for programmatic focus when clicking the container); suggestion fetch abort controller
- `useCallback` — memoize keydown handler, tag remove handler, suggestion click handler
- `useMemo` — derive whether maxTags is reached; derive filtered suggestions (excluding already-added tags)
- Custom hook (`useTagInput`) — manage tags array, deduplication, and maxTags enforcement; expose add/remove/clear

---

## Constraints

- The entire tag-input area must look like a single input field — clicking anywhere in the container focuses the inner input.
- Pasting a comma-separated string must create multiple tags at once.
- Tags must be trimmed and lowercased before deduplication check.
- The `asyncSuggest` function must be debounced 300ms.
- No external tag input libraries.

---

## Edge Cases to Consider

- User types a tag that is all whitespace — must be rejected.
- `maxTags` is 0 — no tags can be added; input is disabled.
- Tag added via suggestion that exactly matches an existing tag (case-insensitively) — prevent duplicate.
- Pasting "a,b,a,c,a" creates tags [a, b, c] with the duplicates silently deduplicated.
- `asyncSuggest` throws an error — hide the dropdown gracefully.
- Tags overflow the container width — the container must expand vertically.
- Component used in a form submission — the tags array must be the form field value.
