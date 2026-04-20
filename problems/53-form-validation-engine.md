# 53 — Declarative Form Validation Engine

## Problem Statement

You are building a reusable, declarative form validation engine for a SaaS platform's forms. The engine must support synchronous validators (required, minLength, pattern) and asynchronous validators (check username availability from API). Errors must appear only after a field has been touched (blurred). Cross-field validation (e.g., password confirmation must match password) must be supported. The engine must be a custom hook, not an external library.

---

## Expected Behavior

- `useForm(schema)` hook accepts a validation schema and returns `{ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid }`.
- Synchronous validators run on every change for touched fields.
- Async validators (e.g., `asyncValidate: checkUsernameAvailability`) run on blur, debounced 500ms.
- While an async validator is in-flight, the field shows a loading indicator.
- Cross-field validators (e.g., `confirmPassword` must equal `password`) re-run when the referenced field changes.
- `handleSubmit` prevents submission if any errors exist. It calls all validators (including untouched fields) before submitting.
- On submit attempt, all fields are marked as touched.

---

## Required React Concepts

- `useReducer` — manage form state: `{ values, errors, touched, asyncStatus }` with SET_VALUE, SET_TOUCHED, SET_ERRORS, SET_ASYNC_STATUS actions
- `useEffect` — run async validators on relevant field blur
- `useRef` — debounce timers per field; latest async validator abort controller
- `useCallback` — memoize `handleChange`, `handleBlur`, `handleSubmit`
- `useMemo` — derive `isValid` (all fields pass all sync validators); derive field-level error messages

---

## Constraints

- No external validation libraries (no Yup, Zod, etc.).
- The schema format must be a plain JavaScript object — one key per field, value is an array of validator functions.
- Async validators must be cancellable (use `AbortController`) — typing again before the validator completes cancels the previous call.
- Cross-field validators must receive the full `values` object, not just the current field's value.

---

## Edge Cases to Consider

- Async validator resolves after the component unmounts — must not call setState.
- Two fields have async validators; both blurred simultaneously — both must run independently.
- Cross-field validator: password field changes after confirmPassword was already validated — re-run confirmPassword validation.
- Submit triggered before any fields are touched — mark all as touched and show all errors at once.
- Required field is empty string vs. undefined vs. null — all three must fail the required validator.
- Async validator is defined on a field, but the field's sync validators already fail — do not fire the async validator.
