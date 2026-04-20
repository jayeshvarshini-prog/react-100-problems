# 36 — Stepper / Progress Tracker Component

## Problem Statement

You are building a reusable stepper component for use across onboarding flows, checkout processes, and setup wizards in a SaaS platform. The stepper shows a horizontal list of steps with labels. Steps can be completed, active, error, or upcoming. Clicking a completed step navigates back to it. The stepper is driven by external state (controlled component). It supports both linear (must complete in order) and non-linear (jump to any step) modes.

---

## Expected Behavior

- Each step is rendered as a circle (numbered or with an icon) and a label.
- Completed steps show a checkmark; error steps show an X icon; the active step is visually prominent; upcoming steps are grayed.
- In linear mode, clicking a completed step returns to it; clicking future steps is disabled.
- In non-linear mode, clicking any step navigates to it directly.
- The connector line between steps is filled for completed steps and gray for upcoming.
- An optional `description` prop under each step label provides additional context.
- Steps with errors show a red error indicator and an optional error message below.

---

## Required React Concepts

- `useState` — no internal state for the basic stepper (fully controlled); local hover state for tooltips
- `useMemo` — derive the display state for each step (completed, active, error, upcoming) from the steps config and currentStep prop
- `useCallback` — memoize the step click handler that calls the `onStepClick` prop
- `useRef` — reference to the active step element to scroll it into view on mobile
- Custom hook (`useStepper`) — for consumers who want uncontrolled usage; manage currentStep, canNavigate, advance, retreat internally

---

## Constraints

- The stepper must be a controlled component with `steps`, `currentStep`, and `onStepClick` props.
- In linear mode, `onStepClick` must only be called for completed steps (guard in the component).
- Must be horizontally scrollable on mobile if steps overflow.
- No external stepper or UI libraries.
- Connector between steps must be a styled element, not just a border trick.

---

## Edge Cases to Consider

- 0 steps passed — must render nothing or an empty container without errors.
- 1 step — no connector lines should render.
- `currentStep` prop is out of bounds — clamp to valid range.
- Step with a very long label — must truncate to 2 lines max without breaking the connector alignment.
- Error step that is also the active step — must show both active and error visual states.
- Steps array changes (step added mid-flow) — existing completed steps must retain their status.
