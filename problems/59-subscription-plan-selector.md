# 59 — Subscription Plan Selector with Billing Toggle

## Problem Statement

You are building the pricing page and plan upgrade flow for a SaaS platform. The page shows plan cards (Free, Pro, Business, Enterprise) with a Monthly/Annual billing toggle. Switching to Annual shows discounted prices and a "Save 20%" badge. Clicking "Upgrade" on a paid plan opens a confirmation step with a proration calculation (if upgrading mid-cycle). The current plan is highlighted. The Enterprise plan shows a "Contact Sales" button instead of a price.

---

## Expected Behavior

- A monthly/annual toggle at the top of the page switches the displayed prices.
- Annual billing shows annual total but with a "per month" equivalent price and the original monthly price struck through.
- The current plan is marked with a "Current Plan" badge and its Upgrade button is disabled.
- Clicking "Upgrade" on a higher-tier plan shows a summary: new plan, new billing amount, proration credit for remaining time on current plan, total due today.
- Clicking "Confirm Upgrade" fires the API and shows a success screen.
- Downgrading shows a "Downgrade" button with a warning that features will be lost.

---

## Required React Concepts

- `useState` — billing cycle (monthly/annual), selected plan for upgrade modal, confirmation loading state
- `useMemo` — derive displayed prices based on billing cycle; derive proration amount from current plan + billing cycle data
- `useCallback` — memoize billing toggle, plan selection, confirm handlers
- `useEffect` — fetch current subscription details on mount
- Custom hook (`usePlanSelector`) — manage billing cycle, upgrade flow state, and proration calculation

---

## Constraints

- Price display must show monthly equivalent even for annual plans ("$X/mo, billed annually at $Y").
- Proration must be a frontend calculation (simulate: remaining days / total days × current plan monthly price = credit).
- No external payment library — this is only the UI, not actual payment processing.
- The plan config (names, prices, features) must be a data structure prop, not hardcoded in JSX.

---

## Edge Cases to Consider

- User is on Annual Pro and tries to switch to Annual Business — proration credit must account for annual billing.
- User is on the highest plan (Business) — Enterprise card shows "Contact Sales", not "Upgrade".
- Billing cycle changes while the upgrade confirmation modal is open — the proration must recalculate.
- Proration credit exceeds the new plan's cost (rare) — show "No charge today; credit applied to next billing cycle."
- User clicks Confirm and the API returns a payment error — show the error in the modal without closing.
- Plan features list is empty — render the plan card without a features section.
