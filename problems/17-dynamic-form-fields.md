# 17 — Dynamic Form with Conditionally Rendered Fields

## Problem Statement

You are building a product configuration form for an e-commerce back-office. The form fields change dynamically based on the product type selected. Selecting "Physical Product" shows shipping fields; selecting "Digital Product" shows download URL and license fields; selecting "Subscription" shows billing interval and trial period fields. Each field set has its own validation rules. The form must correctly track dirty state per field and show validation only after a field has been touched.

---

## Expected Behavior

- A "Product Type" dropdown at the top of the form controls which fields are rendered below.
- Switching product type clears the hidden field values and resets their validation state.
- Only fields relevant to the selected product type are included in the submitted payload.
- Inline validation messages appear beneath each field after it has been blurred (touched).
- The Submit button is disabled until all visible required fields are valid.
- On submit, the payload is logged and a success banner appears.
- Field values persist when switching between product types and back (restore last values).

---

## Required React Concepts

- `useReducer` — manage form state: `{ values, touched, errors, productType }`
- `useState` — per-type value cache to restore values when switching back
- `useEffect` — re-run validation when values or productType changes
- `useMemo` — derive the current field schema and whether the form is submittable
- `useCallback` — memoize field onChange, onBlur handlers
- Custom hook (`useDynamicForm`) — accept a field schema config and return form state + handlers

---

## Constraints

- No external form libraries.
- Field schema config must be a data structure (array of field definitions), not JSX conditionals scattered in the render.
- Validation rules must be declarative (defined in the schema, not in JSX).
- Switching product type must clear errors for fields no longer shown.

---

## Edge Cases to Consider

- User partially fills "Physical" fields, switches to "Digital", then switches back — original values should be restored.
- Required field becomes optional due to product type change while invalid — error must clear.
- Form submitted with no product type selected — show validation on the type selector.
- A field has a dependency on another field's value (e.g., "Trial period" only required if "Has trial" is checked).
- User tabs through hidden fields (must not be focusable).
- Schema is updated at runtime (new product type added) — must not break existing state.
