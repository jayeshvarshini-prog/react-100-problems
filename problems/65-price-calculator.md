# 65 — Dynamic Price Calculator

## Problem Statement

You are building an interactive pricing calculator for a cloud infrastructure SaaS. Users configure their usage (number of servers, storage GB, bandwidth GB, support tier) using sliders and dropdowns. The monthly price updates in real time. Volume discounts apply at certain thresholds. The calculator shows an itemized cost breakdown and a "Request Quote" button that sends the configuration to the sales team.

---

## Expected Behavior

- Sliders for Servers (1–500), Storage (10–50,000 GB), and Bandwidth (100–100,000 GB).
- A dropdown for Support Tier (Community, Standard, Premium, Enterprise).
- The monthly cost updates immediately on any input change (no submit required).
- An itemized breakdown shows cost per line item.
- Volume discount tiers are shown: "You're saving 15% — upgrade to 500 servers to save 20%."
- Clicking "Request Quote" pre-fills a form with the current configuration and opens a contact modal.
- An "Annual" toggle applies a 20% discount to the total.

---

## Required React Concepts

- `useState` — configuration object `{ servers, storageGB, bandwidthGB, supportTier, isAnnual }`
- `useMemo` — derive itemized costs from configuration; derive discount tier; derive total; derive "next discount tier" message
- `useCallback` — memoize slider change handlers (one per dimension to avoid re-renders)
- `useRef` — store the pricing config (price-per-unit rates, discount thresholds) as a stable reference
- Custom hook (`usePriceCalculator`) — accept pricing config and current inputs; return itemized costs, total, discount info

---

## Constraints

- Pricing config (rates, thresholds) must be a prop or context — not hardcoded in the calculation function.
- All calculations must be in `useMemo` — no side effects.
- Sliders must debounce 100ms to avoid excessive recalculation on fast drags.
- Currency must be formatted with `Intl.NumberFormat` (no manual string formatting).

---

## Edge Cases to Consider

- Servers set to 0 (minimum 1) — slider must clamp to 1.
- Volume discount calculation: server tier discount + storage tier discount + support tier pricing all apply simultaneously — must not double-apply.
- Annual toggle changes while a slider is being dragged — total must update correctly.
- Pricing config prop changes (e.g., sale pricing loaded from API) — total must recalculate.
- Very large configuration (500 servers, 50TB storage) — numbers must not overflow JavaScript number precision.
- "Request Quote" clicked — modal form must pre-populate with the current slider values exactly.
