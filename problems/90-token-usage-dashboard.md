# 90 — Token Usage Dashboard (LLM API Billing)

## Problem Statement

You are building a token usage dashboard for an AI SaaS platform. It displays daily, weekly, and monthly LLM API token consumption broken down by model (GPT-4, Claude, Gemini) and by project. Usage is fetched from the API. Budget limits per project are configurable. Projects nearing their limit show a warning. Overage projects are highlighted in red.

---

## Expected Behavior

- On mount, usage data is fetched for the selected time period (default: current month).
- A summary bar shows: total tokens used, estimated cost, budget, and remaining.
- A breakdown table shows usage per project with columns: Project, Model, Tokens Used, Cost, Budget, Usage %.
- A usage % bar per row turns yellow at 80% and red at 100%.
- Clicking a project row expands it to show daily usage for that project as a mini chart.
- A budget edit button on each row opens an inline input to change the budget. Saving fires the API.
- Period tabs (Daily / Weekly / Monthly) re-fetch data for the new period.

---

## Required React Concepts

- `useState` — selected period, expanded project ID, budget edit state per project
- `useEffect` — fetch usage data when period changes
- `useReducer` — manage projects list with LOAD, UPDATE_BUDGET actions
- `useMemo` — derive total tokens, total cost, overall usage%; derive per-row usage% and status; derive expanded project daily data slice
- `useCallback` — memoize period change, row expand, budget save handlers
- Custom hook (`useTokenUsage`) — manage fetch, period, and data state

---

## Constraints

- Budget editing must be inline (not a modal) — clicking the budget cell enables an input in that cell.
- Budget save must be optimistic — update locally before the API call.
- Token counts must be formatted with thousands separators (e.g., "1,234,567").
- Cost must be formatted as currency with `Intl.NumberFormat`.
- No external charting library for the mini chart — use a simple SVG bar chart.

---

## Edge Cases to Consider

- Project has 0 token usage — usage bar shows 0%, not an error.
- Budget is set to 0 — treat as "no budget limit"; do not show a usage % bar.
- Estimated cost rounds to $0.00 for very low usage — display as "<$0.01".
- Switching periods while budget edit is in progress — cancel the in-progress edit.
- Two projects with the same name — must use IDs to distinguish them.
- API returns usage data for a project not in the projects list — add it dynamically.
