# 23 — Command Palette (VS Code / Linear Style)

## Problem Statement

You are building a command palette for a developer-focused SaaS platform. Pressing Cmd+K (Mac) or Ctrl+K (Windows) from anywhere in the app opens a full-screen modal command palette. Users type to fuzzy-search across all registered commands (navigation routes, actions, recent items). Results are grouped by category and ranked by relevance. Selecting a command executes its action and closes the palette.

---

## Expected Behavior

- Pressing Cmd+K / Ctrl+K opens the palette from anywhere in the app.
- The input is auto-focused when the palette opens.
- Typing fuzzy-searches the commands list (e.g., "usr set" matches "User Settings").
- Results are grouped: Navigation, Actions, Recent. Each group shows a heading.
- Arrow Up/Down navigates results; Enter executes the highlighted command.
- Pressing Escape closes the palette.
- Clicking a result executes it and closes the palette.
- Recent commands (last 5) appear when the input is empty.
- Executing a command adds it to the recent list (persisted to localStorage).

---

## Required React Concepts

- `useState` — query string, highlighted index, open state
- `useEffect` — attach global keydown listener for Cmd+K; auto-focus input on open; clean up on unmount
- `useMemo` — derive filtered and ranked results from the query; derive grouped result sections
- `useRef` — reference to the input element; reference to the highlighted item for scroll-into-view
- `useCallback` — memoize keyboard navigation handlers
- Custom hook (`useCommandPalette`) — manage open/close, query, and result state; expose to the host component

---

## Constraints

- Command registration must be declarative: a `commands` array prop or a context-based registry.
- Fuzzy search must score and rank results (not just substring match).
- The global Cmd+K listener must be attached once, not per-component.
- Palette must render via a React Portal.
- No external command palette or fuzzy search libraries.

---

## Edge Cases to Consider

- Cmd+K pressed while a modal is already open — should either stack or be ignored.
- Command list is empty — show "No commands registered" message.
- Query matches 0 commands — show "No results" message.
- Very long command label — truncate with ellipsis.
- `commands` prop changes while palette is open — results must re-filter immediately.
- Command with a keyboard shortcut hint displayed — must not conflict with the palette's own shortcut.
- User presses Enter with no command highlighted — should do nothing.
- Palette opened on a page where Cmd+K is already used by a browser feature (DevTools) — document the potential conflict.
