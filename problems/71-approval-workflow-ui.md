# 71 — Approval Workflow UI

## Problem Statement

You are building the approval workflow interface for a procurement SaaS. Purchase requests go through a multi-level approval chain (Requester → Manager → Finance → VP). The current approver can approve or reject at each stage. Rejection requires a reason. Approved items move to the next stage automatically. The approval chain is visualized as a step tracker with the current approver highlighted.

---

## Expected Behavior

- The page loads the purchase request details and its approval chain from the API.
- The approval chain is shown as a horizontal stepper: each stage shows approver name, status (pending/approved/rejected), and timestamp.
- The current stage is highlighted. The current user's stage shows "Approve" and "Reject" buttons if they are the current approver.
- Clicking "Reject" opens a modal requiring a rejection reason (min 10 characters).
- Clicking "Approve" sends the approval to the API and advances the stepper to the next stage optimistically.
- If the approval API call fails, the stepper reverts.
- Fully approved requests show a "Complete" state. Rejected requests show the rejection reason and who rejected it.

---

## Required React Concepts

- `useState` — approval chain data, reject modal open, rejection reason text, loading state
- `useEffect` — fetch request and approval chain on mount
- `useReducer` — manage approval chain state with APPROVE_STAGE, REJECT_STAGE, REVERT_STAGE actions
- `useMemo` — derive current stage index; derive whether the current user is the active approver; derive form validity (rejection reason length)
- `useCallback` — memoize approve, reject submit, and modal open/close handlers
- `useRef` — snapshot of pre-optimistic state for revert

---

## Constraints

- Optimistic update must happen before the API call.
- Revert on failure must restore the exact pre-mutation state.
- Rejection reason must be at least 10 characters — validate before enabling the submit button.
- If the current user is not the active approver, approval/rejection buttons must not render.

---

## Edge Cases to Consider

- Current user is the approver for multiple stages (e.g., Finance and VP are the same person) — each stage must be independently approvable.
- Approval API call returns 409 (already approved by someone else) — show "Already actioned. Please refresh." and re-fetch.
- Rejection reason contains only spaces — must fail the minimum-length validation.
- Request has already been fully approved when the page loads — show read-only complete state, no action buttons.
- Network failure during approval — revert stepper, show error toast; approval buttons re-enable.
- Approval chain has 1 stage only — complete on first approval.
