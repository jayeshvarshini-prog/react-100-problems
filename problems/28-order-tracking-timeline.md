# 28 — Order Tracking Timeline

## Problem Statement

You are building the order status tracking page for an e-commerce platform. The page displays a vertical timeline of order lifecycle events (Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered). The current status is highlighted. Completed steps are marked with checkmarks. The estimated delivery date is shown prominently. The page auto-refreshes every 60 seconds to pick up status updates without requiring a manual page reload.

---

## Expected Behavior

- On mount, order details are fetched from `/api/orders/:id`.
- A vertical stepper timeline renders all possible stages. Completed stages show a checkmark; the active stage is highlighted; future stages are grayed out.
- The estimated delivery date is displayed with a countdown ("Arrives in 2 days").
- Every 60 seconds, the order status is re-fetched. If the status has changed, the timeline updates smoothly.
- A "Refresh Now" button triggers an immediate re-fetch.
- If the order is delivered, the auto-refresh stops.
- Shipment tracking number (if available) links to the carrier's tracking page (opens in a new tab).

---

## Required React Concepts

- `useState` — order data, loading state, last-refreshed timestamp
- `useEffect` — fetch order on mount; set up 60s interval; clean up on unmount; stop interval on delivered status
- `useRef` — store the interval ID for cancellation; store the previous status to detect changes
- `useMemo` — derive the timeline steps array with computed status (completed/active/pending) from the order data
- `useCallback` — memoize the fetch/refresh handler

---

## Constraints

- Auto-refresh must stop after the order reaches "Delivered" status — no wasted API calls.
- Refresh must not cause a full skeleton re-render; update the existing timeline in-place.
- Countdown to delivery must recalculate every second using a separate interval.
- Carrier tracking link must use `rel="noopener noreferrer"` for security.

---

## Edge Cases to Consider

- Order fetch fails on mount — show a full-page error with a "Try Again" button.
- Order fetch fails during auto-refresh — do not show an error; silently retry on the next interval.
- Order status goes from "Shipped" to "Delivered" between two polls — must correctly advance two steps.
- Estimated delivery is in the past (delayed order) — show "Delayed" instead of a positive countdown.
- Interval fires while a previous fetch is still in-flight — must not fire a second request.
- Order ID in URL is invalid (404 response) — show "Order not found" page.
