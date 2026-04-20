# 73 — Code Snippet Display with Syntax Highlighting and Copy

## Problem Statement

You are building a reusable code snippet component for a developer documentation portal. The component renders a code block with syntax highlighting, a language badge, a copy-to-clipboard button, and optional line numbers. Syntax highlighting is implemented client-side without any external library. The component supports light and dark themes. Long lines wrap or scroll horizontally based on a prop.

---

## Expected Behavior

- The component accepts `code` (string), `language` (string), `showLineNumbers` (bool), `wrap` (bool) props.
- Syntax highlighting is applied for JavaScript, TypeScript, Python, JSON, and Bash.
- A language badge in the top-right corner shows the language name.
- A copy button copies the code to clipboard. After clicking, it shows a "Copied!" label for 2 seconds.
- Line numbers are shown in a gutter column if `showLineNumbers` is true.
- Long lines scroll horizontally if `wrap` is false; wrap to the next line if `wrap` is true.
- The component respects the active app theme (light/dark) from the theme context.

---

## Required React Concepts

- `useState` — copied state (for the 2-second "Copied!" feedback)
- `useEffect` — reset the copied state after 2 seconds (clear timeout on unmount)
- `useRef` — timeout ID for copied reset; pre element ref for clipboard fallback
- `useMemo` — apply syntax highlighting to the code string; split into lines for line number rendering
- `useContext` — read the active theme
- `useCallback` — memoize the copy handler

---

## Constraints

- Syntax highlighting must be implemented with regex-based token detection — no external library (no Prism, Highlight.js, etc.).
- The highlighting must produce span elements with CSS classes (e.g., `token keyword`, `token string`).
- Copy must use `navigator.clipboard.writeText` with a fallback for HTTP contexts.
- The component must be pure and memoized with `React.memo` — it must not re-render if `code` and `language` have not changed.

---

## Edge Cases to Consider

- Code string is empty — render an empty block with the language badge still visible.
- Code has 1000+ lines — line numbers must render without performance issues.
- Language prop is an unsupported value — render without highlighting (plain text).
- Code contains HTML special characters (`<`, `>`, `&`) — must escape them before rendering to avoid XSS.
- Clipboard API unavailable — fallback: select the text in the `<pre>` element and use `document.execCommand('copy')`.
- "Copied!" shown, user clicks copy again before 2 seconds — must restart the 2-second timer.
