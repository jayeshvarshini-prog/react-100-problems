# 30 — Currency Converter with Live Exchange Rates

## Problem Statement

You are building a currency converter widget for a fintech dashboard. The widget allows users to input an amount, select a source currency, and select a target currency. Exchange rates are fetched from a mock API. The converted amount updates automatically when the input, source currency, or target currency changes. Rates are cached for 60 seconds to avoid redundant API calls. Swapping source and target currencies should reverse the input and output values.

---

## Expected Behavior

- User types an amount and selects source and target currencies.
- Converted amount appears in real time (debounced 200ms on input change).
- Exchange rates are fetched once and cached. A "Rate expires in Xs" countdown is shown.
- When the cache expires, the rates are automatically re-fetched.
- The "Swap" button reverses the source/target currencies and swaps input/output values.
- A loading state is shown while rates are fetching.
- If rate fetch fails, show an error message and a "Retry" button.
- Historical rate trend (last 7 days) is shown as a small sparkline below the converter.

---

## Required React Concepts

- `useState` — amount, source currency, target currency, rates data, loading, error
- `useEffect` — fetch rates on mount; set up 60s expiry timer; auto-refetch on expiry
- `useRef` — store the cache timestamp and expiry timer ID
- `useMemo` — derive the converted amount from amount, rates, and currency pair; derive the sparkline data
- `useCallback` — memoize the swap handler, currency change handlers
- Custom hook (`useExchangeRates`) — manage fetching, caching, expiry, and retry of exchange rates

---

## Constraints

- Rate cache must be module-level (shared across instances) so two widgets on the same page share one cache.
- Debounce must apply to the amount input only, not to currency selection changes.
- Swap must be instantaneous (no API call) — the already-fetched rates contain both directions.
- Currency list must include at least 10 currencies with proper ISO codes.

---

## Edge Cases to Consider

- User inputs a non-numeric value — input field must reject it; do not show NaN in the output.
- Source and target currencies are the same — output equals input (rate is 1).
- API returns rate of 0 for a currency pair — handle division-by-zero.
- Cache expires while the user is actively typing — re-fetch must not interrupt the input.
- Amount input is empty — output should show 0.00, not NaN or empty.
- Network offline when cache expires — show stale rates with a "Rates may be outdated" banner.
