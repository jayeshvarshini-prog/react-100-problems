# 35 — Responsive Navigation with Mega Menu

## Problem Statement

You are building the primary navigation for a large SaaS platform. The desktop nav has a mega menu: hovering over top-level items reveals a multi-column dropdown with links, featured items, and a CTA panel. On mobile, the nav collapses into a hamburger menu with an animated slide-in drawer. The active route is highlighted in the nav. Keyboard navigation must be fully supported.

---

## Expected Behavior

- Desktop: hovering over a top-level nav item opens its mega menu after a 100ms delay. Moving the mouse to the mega menu keeps it open. Moving away closes it after a 150ms grace period.
- The mega menu shows 3–4 columns of links and one featured CTA panel.
- Mobile: clicking the hamburger icon slides in the drawer. Top-level items with children expand/collapse as accordions.
- The current route is highlighted in both desktop and mobile nav.
- Keyboard: Tab moves through nav items; Enter/Space opens a mega menu; Escape closes it; arrow keys navigate within the mega menu.
- Focus is trapped inside the mobile drawer when it is open.

---

## Required React Concepts

- `useState` — active mega menu key, mobile drawer open state, mobile accordion open states (Map)
- `useEffect` — attach resize listener to switch between mobile and desktop modes; close drawer on route change
- `useRef` — hover delay timers (enter and leave) to implement the 100ms/150ms delays; drawer container ref for focus trap
- `useCallback` — memoize mouse enter/leave handlers, accordion toggle, drawer toggle
- `useMemo` — derive nav config with active states from current route
- Custom hook (`useHoverIntent`) — accept enter delay and leave delay; return `{ isOpen, handleMouseEnter, handleMouseLeave }`

---

## Constraints

- Hover delays must be implemented with `setTimeout`/`useRef` — no CSS-only hover states.
- Mobile breakpoint detection must use `window.matchMedia`, not hardcoded pixel checks.
- Focus trap in mobile drawer must handle dynamically added links.
- No external menu or navigation libraries.

---

## Edge Cases to Consider

- Mouse moves from nav item to mega menu quickly — the menu must not flicker closed between the two.
- User opens mobile drawer on small tablet, then resizes to desktop width — drawer must close automatically.
- Clicking a mega menu link navigates — the mega menu must close immediately.
- Keyboard user tabs past the last mega menu item — mega menu closes, focus moves to next nav item.
- Nav has too many items to fit in one row — overflow items collapse into a "More" dropdown.
- Screen reader: mega menu regions must have correct ARIA roles and labels.
