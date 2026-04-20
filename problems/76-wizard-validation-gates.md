# 76 — Wizard with Async Validation Gates

## Problem Statement

You are building a multi-step domain configuration wizard for a hosting SaaS. Each step has a validation gate that must pass before the user can advance. Some validations are async: Step 2 checks DNS propagation (takes 5–30 seconds), Step 3 verifies SSL certificate issuance. The user must wait for these async checks before proceeding. The wizard shows real-time status updates during async validation.

---

## Expected Behavior

- Step 1 (Domain Entry): user enters a domain. Sync validation (valid format). "Next" advances immediately.
- Step 2 (DNS Check): user clicks "Verify DNS". A background job starts. Status messages stream: "Checking DNS… found A record… verifying TTL… DNS verified!"
- The "Next" button enables only after DNS check passes.
- Step 3 (SSL): user clicks "Issue SSL Certificate". Similar streaming status messages.
- If any async check fails, an error message appears with a "Retry" button.
- A step cannot be re-visited after async validation unless the user explicitly clicks "Start Over".
- The wizard shows a progress timeline on the left.

---

## Required React Concepts

- `useReducer` — manage wizard state: steps array with `{ status: 'pending' | 'validating' | 'valid' | 'error', messages: string[] }`, current step
- `useState` — streaming status messages per step
- `useEffect` — open SSE connection for streaming validation status messages; close on completion or component unmount
- `useRef` — EventSource instance for each async validation; step completion callback ref
- `useMemo` — derive whether the current step allows advancing; derive overall progress
- `useCallback` — memoize start-validation, retry, next-step handlers
- Custom hook (`useAsyncValidationStep`) — manage SSE connection, message accumulation, and pass/fail state for a step

---

## Constraints

- Each async step's SSE connection must be opened only when the user clicks "Verify" — not on step mount.
- SSE connection must be closed on: step success, step failure, component unmount, or "Start Over".
- Steps must not auto-advance — the user must explicitly click "Next" after the async check passes.
- "Start Over" must close any open SSE connections and reset all step states.

---

## Edge Cases to Consider

- Async check succeeds but user navigates away (browser back) — SSE must close.
- SSE stream sends an error event before the success event — must show error state, stop listening.
- Network disconnects during async validation — SSE auto-reconnects; must resume message streaming or show reconnect status.
- Retry after failure must open a new SSE connection, not reuse the closed one.
- User completes step 2 and waits 10 minutes before starting step 3 — DNS check result is still valid; do not re-validate.
