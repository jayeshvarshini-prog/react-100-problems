# 09 — Autocomplete Search Input with Keyboard Navigation

## Problem Statement

You are building a reusable autocomplete input component for use across an enterprise SaaS platform. The component accepts an async `fetchSuggestions` prop and renders a dropdown of matching suggestions as the user types. Full keyboard navigation must be supported (Arrow Up/Down to navigate suggestions, Enter to select, Escape to dismiss). The component must be accessible (ARIA attributes for screen readers). It should support both free-text input (user can submit without selecting a suggestion) and constrained mode (user must select from suggestions).

---

## Expected Behavior

- Typing at least 2 characters triggers `fetchSuggestions` with the current query (debounced 300ms).
- Suggestions appear in a dropdown below the input.
- Arrow Down moves highlight to the first suggestion; subsequent presses move down the list.
- Arrow Up moves highlight upward; from the first item, it returns focus to the input.
- Pressing Enter while a suggestion is highlighted selects it, populates the input, and closes the dropdown.
- Pressing Escape clears the highlight and closes the dropdown without changing the input value.
- In constrained mode, if the user blurs without selecting a suggestion, the input is cleared.
- The selected item is passed to an `onSelect` callback prop.

---

## Required React Concepts

- `useState` — input value, suggestions array, highlighted index, open state, loading state
- `useEffect` — set up debounce timer for fetching; cancel on cleanup
- `useRef` — reference to the input element (for programmatic focus); reference to the list container (for scrolling highlighted item into view)
- `useCallback` — memoize keyboard event handler and outside-click handler
- Custom hook (`useAutocomplete`) — encapsulate all autocomplete logic, returning state and handlers to the component

---

## Constraints

- Must implement ARIA pattern: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, `aria-autocomplete`.
- Must scroll the highlighted suggestion into view when navigating with keyboard.
- No external autocomplete libraries.
- Must be a controlled component — value controlled by the parent via `value` and `onChange` props.
- The `fetchSuggestions` function must be called with a cleanup mechanism so stale results are discarded.

---

## Edge Cases to Consider

- Fetch returns after user has already typed more characters — stale suggestions must be discarded.
- Suggestions list is empty — do not render an empty dropdown; show "No suggestions" or close.
- User pastes a long string — debounce must still apply.
- Fetch throws an error — do not crash; close dropdown gracefully.
- `fetchSuggestions` prop changes (parent re-renders) — must not cause a stale closure bug.
- Highlighted index goes out of bounds when suggestions list shrinks between fetches.
- Component used in a form — Enter key to select a suggestion must not submit the form.
