# 55 — Fully Keyboard-Navigable Component Library

## Problem Statement

You are building a suite of accessible UI components for an enterprise design system. Specifically: a Listbox, a Combobox, a RadioGroup, and a custom Select. Each component must follow the ARIA Authoring Practices Guide (APG) patterns precisely. All components must be usable with only a keyboard and must work correctly with screen readers (VoiceOver, NVDA).

---

## Expected Behavior

**Listbox:**
- Arrow Up/Down navigate between options.
- Home/End jump to first/last.
- Space or Enter select the highlighted option.
- Type-ahead: typing a character jumps to the first option starting with that character.

**RadioGroup:**
- Arrow keys move focus between radio buttons and select them.
- Tab moves focus into and out of the group.

**Custom Select:**
- Click or Enter/Space opens the dropdown.
- Arrow Up/Down navigate options.
- Enter selects the highlighted option and closes the dropdown.
- Escape closes without selection.
- When closed, the selected option's label is shown on the trigger.

**Combobox:**
- Typing filters options; Arrow Down opens the dropdown and moves focus; Enter selects.
- Escape clears the input and closes the dropdown.

---

## Required React Concepts

- `useState` — open/closed state, highlighted index, selected value(s), type-ahead buffer
- `useEffect` — type-ahead timeout (clear after 500ms of no typing); keyboard listener attachment
- `useRef` — reference to the list container; references to option elements for scroll-into-view; type-ahead timer
- `useMemo` — derive filtered options (combobox); derive type-ahead match index
- `useCallback` — memoize all keyboard handlers
- Custom hook (`useListboxKeyboard`) — reusable keyboard navigation logic shared across Listbox, Select, Combobox

---

## Constraints

- All components must have correct ARIA attributes: `role`, `aria-selected`, `aria-activedescendant`, `aria-expanded`, `aria-controls`.
- Focus must be managed programmatically — never lost during keyboard navigation.
- The shared `useListboxKeyboard` hook must be reusable across all four components.
- No external accessibility libraries.

---

## Edge Cases to Consider

- List has 1 item — Arrow Up/Down from it should not move focus.
- Options change while the dropdown is open (combobox) — highlighted index must be reset or clamped.
- Disabled options must be skipped during keyboard navigation.
- Scroll container needed — highlighted item must always scroll into view.
- Multiple identical option labels — each must have a unique ID for `aria-activedescendant`.
- Select inside a form — pressing Enter to open the dropdown must not submit the form.
