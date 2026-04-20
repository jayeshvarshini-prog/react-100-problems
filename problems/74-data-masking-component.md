# 74 — Data Masking Component (PII Protection)

## Problem Statement

You are building a PII (Personally Identifiable Information) masking system for a customer support SaaS. Sensitive fields (email, phone, credit card last 4, SSN) are displayed as masked values by default (e.g., "j***@example.com"). Users with the `pii:unmask` permission can click a "Reveal" button to unmask a specific field. The unmasked value is fetched from a secure API endpoint. After 30 seconds, the field automatically re-masks. All reveal actions are audit-logged.

---

## Expected Behavior

- Masked fields display a partially hidden value.
- A "Reveal" button (eye icon) is shown for users with `pii:unmask` permission.
- Clicking "Reveal" calls the API to get the unmasked value, then displays it.
- A 30-second countdown is shown while the field is unmasked.
- After 30 seconds, the field re-masks automatically.
- Clicking "Hide" re-masks the field immediately (before the 30s timer).
- Audit log entry is created server-side on each reveal action.
- Multiple masked fields on the same page each have independent timers.

---

## Required React Concepts

- `useState` — revealed value, countdown seconds, loading state, error
- `useEffect` — start 30-second countdown when value is revealed; clean up on re-mask or unmount
- `useRef` — countdown interval ID; stable field ID for the audit log call
- `useMemo` — derive whether the current user has `pii:unmask` permission
- `useCallback` — memoize reveal and hide handlers
- Custom hook (`useMaskedField`) — accept `fieldId`, `maskedValue`; return `{ displayValue, isRevealed, countdown, reveal, hide, isLoading, error }`

---

## Constraints

- Unmasked values must never be stored in localStorage or sessionStorage.
- The unmasked value must be cleared from component state when the component unmounts.
- Multiple instances of `useMaskedField` on the same page must each have an independent timer.
- The reveal API call must include the field ID and the reason (from a reasons dropdown — "Customer Support", "Billing Dispute", "Other").

---

## Edge Cases to Consider

- Reveal API returns a 403 (permission revoked between page load and click) — show "Access denied" inline.
- Countdown reaches 0 while the user's cursor is hovering over the field — must still re-mask.
- Network failure during reveal — show an error; do not display partial data.
- Two "Reveal" clicks before the first resolves — must prevent duplicate API calls.
- Field is already revealed when the component mounts (via SSR or server-sent data) — start the timer immediately.
- SSN field: must never display more than the last 4 digits even in unmasked state.
