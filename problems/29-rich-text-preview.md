# 29 — Live Rich Text Markdown Preview Editor

## Problem Statement

You are building a split-pane markdown editor for a documentation platform. The left pane is a plain textarea for writing markdown. The right pane renders a live HTML preview of the markdown content. The preview updates as the user types. Both panes scroll in sync: scrolling the editor scrolls the preview to the corresponding section. A toolbar provides formatting buttons (Bold, Italic, Heading, Link, Code Block) that insert the corresponding markdown syntax at the cursor position.

---

## Expected Behavior

- Typing in the editor textarea updates the preview pane in real time (debounced 150ms to avoid thrashing).
- The toolbar Bold button wraps the selected text in `**...**` or inserts `****` at the cursor if nothing is selected.
- Italic, Heading (H1/H2/H3), Code Block, and Link buttons follow the same insert/wrap pattern.
- Scrolling either pane scrolls the other proportionally (scroll percentage sync).
- The editor and preview panes are resizable (drag the divider between them).
- Content is auto-saved to localStorage every 5 seconds.
- A word count and character count are displayed in the status bar.

---

## Required React Concepts

- `useState` — markdown content, pane width ratio
- `useEffect` — debounced preview update; auto-save to localStorage; restore from localStorage on mount
- `useRef` — reference to the textarea (for cursor position manipulation); reference to both panes (for scroll sync); reference to the resize divider
- `useMemo` — parse markdown to HTML (using a pure function); derive word count and character count
- `useCallback` — memoize toolbar action handlers; memoize scroll sync handlers
- Custom hook (`useResizablePanes`) — handle mouse drag on the divider to update pane ratio

---

## Constraints

- Markdown parsing must be implemented manually for basic syntax (bold, italic, headings, code, links, lists) — no external markdown libraries.
- Scroll sync must use percentage-based sync, not line-number-based.
- Toolbar insert operations must correctly restore cursor position after insertion.
- Auto-save must use `useRef` for the timer to avoid stale closures.

---

## Edge Cases to Consider

- Pasting a very large block of text (10,000 words) — preview update must not block the UI (use debounce).
- User selects text spanning multiple formatting types and clicks Bold — wrap the entire selection.
- Divider dragged all the way to one edge — clamp pane width to a minimum (e.g., 20%).
- localStorage auto-save fails (storage full) — fail silently.
- User opens two tabs with the same editor — localStorage sync between tabs.
- Preview HTML contains a script tag from user input — must be escaped/sanitized before rendering.
