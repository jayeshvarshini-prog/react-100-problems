# 126 — Form Submission with Async Validation and Error Handling

## Problem Statement

Build a registration form with username, email, and password fields. On submit, first run client-side validation synchronously, then check if the username is already taken via an async API call, then POST the form data. Each step has its own error display. The submit button must be disabled during any async operation.

---

## Expected Behavior

- User fills out the form and clicks Submit.
- Immediate (synchronous) validation runs first: required fields, email format, password length. Errors appear inline under each field.
- If client-side validation passes, an async username-availability check fires. The button shows "Checking username..." and is disabled.
- If the username is taken, show "Username already taken" under the username field and re-enable the form.
- If the username is available, the form POST fires. Button shows "Submitting...".
- On POST success, show a success message and clear the form.
- On POST failure, show a top-level error banner (e.g., "Registration failed. Please try again.").

---

## Required Concepts

- Synchronous validation before any `await`
- Sequential async steps: validate → check username → POST
- `try/catch` with step-aware error routing
- `useState` — fieldErrors (object), globalError, submitting stage
- Disabling the submit button during async stages

---

## Constraints

- Do not use a form library (no React Hook Form, Formik, etc.).
- Client-side validation must run before any network call is made.
- The form must not be submittable again while a submission is in-flight.

---

## Edge Cases to Consider

- User edits a field after a validation error — does the per-field error clear on change?
- What if the username check request takes 5 seconds — is the user informed of progress?
- What if the user submits, fails the username check, edits the username, and resubmits — does the previous error clear?
