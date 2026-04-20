# 21 — Tabbed Interface with URL-Synced Routing

## Problem Statement

You are building the settings page for a SaaS account dashboard. The page is divided into tabs: General, Security, Billing, Notifications, and Integrations. The active tab is reflected in the URL (`/settings?tab=security`) so users can link directly to a tab. Each tab panel lazy-loads its content when first activated. Previously loaded tab panels are kept in the DOM but hidden (not unmounted) to preserve scroll position and local state.

---

## Expected Behavior

- On load, the active tab is determined by the `tab` URL parameter. If absent, default to "general".
- Clicking a tab updates the URL query string and shows the corresponding panel.
- Each tab panel fetches its own data the first time it becomes active.
- Once loaded, a tab's data is not re-fetched on subsequent tab visits.
- Panels that have been visited are kept in the DOM (hidden with CSS) to preserve state.
- A loading spinner inside each panel is shown during its initial data fetch.
- Tab headings show a notification badge if the section has pending action items (e.g., "Billing" has a badge if payment is past due).

---

## Required React Concepts

- `useState` — active tab key, per-tab loaded flags
- `useEffect` — sync active tab with URL on mount; update URL on tab change
- `useMemo` — derive the badge state for each tab from their respective data
- `useRef` — track which tabs have been visited (to prevent re-fetching)
- Custom hook (`useTabRouter`) — accept tab config and default tab; return `{ activeTab, setTab }` synced to URL

---

## Constraints

- Tab panels that have been visited must not unmount. Use CSS visibility/display toggling.
- Tab panels that have not been visited must not mount until activated (no pre-fetching).
- URL changes must use `history.replaceState`, not `pushState`, to avoid polluting browser history with every tab click.
- Tab key values in the URL must be validated — invalid tab keys must fall back to default.

---

## Edge Cases to Consider

- User navigates to `/settings?tab=invalid` — must show default tab, not a blank page.
- Billing tab badge depends on data from the Billing panel fetch — badge must not flash before data loads.
- User opens the page, switches to Security tab, then presses browser Back — should return to General tab.
- Tab panel has a form with unsaved changes; user clicks another tab — show a "Leave without saving?" confirmation.
- Tab panel fetch fails — show per-tab error state with retry button.
- Keyboard navigation — Arrow Left/Right should move between tabs when a tab is focused.
