# 03 — Multi-Step Registration Form Wizard

## Problem Statement

You are building a multi-step onboarding form for a B2B SaaS platform. The form has 4 steps: (1) Account Info, (2) Company Details, (3) Plan Selection, (4) Review & Submit. The user can navigate forward only if the current step passes validation. They can navigate backward freely without losing already-entered data. A progress bar at the top shows completion percentage. On final submission, the full form payload is sent to an API endpoint.

---

## Expected Behavior

- The form renders one step at a time. Clicking "Next" validates the current step's fields before advancing.
- Clicking "Back" returns to the previous step with all previously entered values intact.
- The progress bar updates as steps are completed.
- Field-level validation errors are shown inline beneath each input on submission attempt.
- The final step (Review) displays a read-only summary of all entered data before submission.
- On submit, a loading state disables the submit button and shows a spinner.
- On API success, redirect to a confirmation screen. On failure, show a top-level error message.

---

## Required React Concepts

- `useReducer` — manage the entire multi-step form state (step index, field values, validation errors, submission state) as a single reducer
- `useState` — local UI states within individual step components
- `useCallback` — memoize validation functions per step to prevent re-creation on each render
- `useMemo` — derive whether the current step is valid to conditionally enable the Next button
- Custom hook (`useFormWizard`) — encapsulate step navigation logic, validation dispatch, and submission

---

## Constraints

- No external form libraries (no Formik, React Hook Form, Yup, etc.).
- All validation must be written manually.
- Form state must survive step navigation (no data loss on Back).
- The component tree must be designed so each step is a separate component receiving only its slice of state.

---

## Edge Cases to Consider

- User presses browser Back button on step 3 — should not lose form data.
- Required field left blank but user clicks Next rapidly twice — validation must fire once, not twice.
- Step 3 (Plan Selection) depends on data from Step 2 (Company size drives available plans) — derived state must update correctly.
- API submission fails with a 422 validation error containing field-level errors — map server errors back to the correct step's fields.
- User refreshes mid-wizard — decide whether to persist state to sessionStorage and restore on mount.
- Plan selection step has radio buttons — ensure controlled input pattern is correct.
