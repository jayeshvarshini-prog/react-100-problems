# 61 — A/B Test Variant Component

## Problem Statement

You are building the client-side A/B testing infrastructure for a growth SaaS platform. A component `<ABTest experiment="checkout-button-color">` renders one of several variants based on the user's assigned variant (fetched from the experimentation service). The assignment is sticky (same user always gets the same variant). Exposure events are tracked when a variant renders. A developer mode overlay shows which variant is active.

---

## Expected Behavior

- `<ABTest experiment="checkout-cta">` fetches the user's variant assignment from an experiment context.
- It renders the matching `<Variant name="control">` or `<Variant name="treatment">` child.
- On first render of a variant, an exposure event is sent to the analytics API.
- Exposure events are sent at most once per experiment per session (deduplicated).
- A keyboard shortcut (Ctrl+Shift+X) toggles a developer overlay showing: experiment name, active variant, all variants, a switcher to override the variant locally.
- The variant override in dev mode is stored in sessionStorage.

---

## Required React Concepts

- `useContext` — access the experiment assignment service (provides `getVariant(experimentName)`)
- `useState` — dev overlay visible, local variant override
- `useEffect` — fire the exposure event on mount (with deduplication check)
- `useRef` — set of already-fired exposure events (module-level or ref, persists across renders)
- `useMemo` — derive the active variant key (from override or assignment)
- Custom hook (`useABTest`) — accept experiment name; return active variant, isLoading, overrideVariant

---

## Constraints

- Exposure events must be fired at most once per experiment per browser session.
- The component must render nothing (null) if the experiment assignments are still loading.
- Dev overlay must not appear in production builds (check `process.env.NODE_ENV`).
- Variant assignment must be deterministic — same user always gets the same variant (handled by the context service, not the component).

---

## Edge Cases to Consider

- Experiment name does not exist in the assignment service — render the "control" variant as default.
- All variants defined in JSX don't match the assigned variant name — render nothing and log a warning.
- Two `<ABTest>` components with the same experiment name on the same page — only one exposure event fired.
- Assignment service is down (returns error) — render control variant, do not fire an exposure event.
- Dev mode override set to a variant that doesn't exist in the child `<Variant>` components — fall back to control.
- Component remounts (key change) — must not fire a duplicate exposure event.
