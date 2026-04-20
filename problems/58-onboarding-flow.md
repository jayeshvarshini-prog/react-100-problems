# 58 — Product Onboarding Flow with Checklist

## Problem Statement

You are building the new user onboarding experience for a SaaS platform. After signup, users are guided through a checklist of setup steps: (1) Complete profile, (2) Invite a team member, (3) Connect an integration, (4) Create first project. The checklist persists in the user's account and shows progress. A dismissible tooltip coach mark highlights the relevant UI area for each incomplete step. Completing all steps shows a congratulations modal.

---

## Expected Behavior

- On first login, the onboarding checklist panel slides in from the bottom-right.
- The panel shows all steps with completed (checkmark) and incomplete states.
- Each step has a "Start" or "Go" link that navigates to the relevant section.
- When the user performs the action for a step (e.g., creates a project), the step auto-completes without requiring a manual check.
- Completion status is fetched from the API on mount and updated on each step completion.
- A progress bar shows overall completion percentage.
- Closing the panel stores the dismissed state; the panel does not reappear on future logins until a new step is added.
- When all 4 steps are completed, a confetti animation and congratulations modal appear.

---

## Required React Concepts

- `useState` — panel open/closed, steps array with completion status
- `useEffect` — fetch step completion status on mount; listen to custom events fired by other components when an action completes
- `useContext` — provide `completeStep(stepId)` function throughout the app (called by feature components when the relevant action is performed)
- `useMemo` — derive completion percentage; derive whether all steps are done
- `useCallback` — memoize step navigation and dismiss handlers
- Custom hook (`useOnboarding`) — expose step state, `completeStep`, and panel visibility

---

## Constraints

- Step completion events must be dispatched by the feature components themselves (not by the onboarding component watching routes).
- `completeStep` must be idempotent — calling it twice for the same step must not cause duplicate API calls.
- The confetti/congratulations modal must fire only once (not on every re-render after all steps complete).
- Dismissed state must be stored in the user account (API call) and in localStorage as a cache.

---

## Edge Cases to Consider

- User completes step 3 before step 2 — non-linear completion must be handled.
- All steps already completed on first load (power user who skipped onboarding) — do not show the panel.
- API call to mark step complete fails — the step must visually revert.
- New step added by the product team — the checklist must pick it up and re-open the panel.
- User is on a mobile screen — panel must stack differently or be accessible as a full-screen sheet.
