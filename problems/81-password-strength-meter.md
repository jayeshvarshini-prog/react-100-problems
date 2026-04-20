# 81 — Password Strength Meter with Real-Time Feedback

## Problem Statement

You are building a password strength meter for a security-conscious SaaS signup flow. As the user types their password, the meter evaluates strength based on multiple criteria and provides real-time visual feedback. The evaluation must account for length, character variety, common patterns, and dictionary words. A checklist of requirements must update in real time.

---

## Expected Behavior

- As the user types, the strength meter updates in real time (no debounce — immediate).
- A colored bar (4 segments: Weak/Fair/Good/Strong) fills based on the strength score.
- Below the input, a checklist shows requirement status:
  - ✓/✗ At least 8 characters
  - ✓/✗ Uppercase letter
  - ✓/✗ Number
  - ✓/✗ Special character
  - ✓/✗ Not a common password (checked against a local list)
- The score is 0–4 based on how many criteria pass.
- A "Show/Hide" password toggle button is included.
- The form's "Create Account" button is disabled until strength is at least 3 (Good).

---

## Required React Concepts

- `useState` — password value, show/hide toggle
- `useMemo` — evaluate all password criteria and compute the strength score from the password value (runs on every keypress — must be fast)
- `useCallback` — memoize show/hide toggle handler and input change handler
- `useRef` — reference to a local common passwords Set for O(1) lookup

---

## Constraints

- All strength evaluation must be in `useMemo` — no side effects.
- Common passwords check must use a local Set of at least 20 common passwords (not an API call).
- The strength bar animation must be CSS-only (width transition).
- No external password strength libraries.
- The `useMemo` computation must complete in < 1ms to avoid input lag.

---

## Edge Cases to Consider

- Password is exactly 8 characters — length check passes; must not require 9.
- Password is "Password1!" — despite meeting all character criteria, it should score lower for being a common pattern.
- User pastes a very long password (256+ characters) — must evaluate correctly.
- Show/Hide toggled while typing — must not lose focus or reset the value.
- Special character is a space — must it count? Define and document the behavior.
- Score is exactly 3 (Good) — the submit button must enable.
- Score drops from 3 to 2 (user deletes a character) — submit button must disable again.
