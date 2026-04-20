# 91 — Sticky Header with Scroll-Driven State Changes

## Problem Statement

You are building a sticky page header for a SaaS product page that changes appearance as the user scrolls. At the top of the page, the header is transparent and large. After scrolling 80px, it transitions to a compact, opaque, shadow-dropped header. A scroll-to-top button appears when the user has scrolled more than 300px. The active section is highlighted in the nav based on which section is currently in the viewport.

---

## Expected Behavior

- The header starts with a transparent background and large logo/font.
- After the user scrolls 80px down, the header smoothly transitions to a compact, white/dark background with a drop shadow.
- The transition is CSS-driven (class toggle); React only toggles the class.
- A floating scroll-to-top button appears at the bottom-right after 300px of scroll.
- The nav links highlight the active section as the user scrolls through the page (section intersection).
- The header does not re-render on every scroll pixel — only when relevant thresholds are crossed.

---

## Required React Concepts

- `useState` — isCompact (boolean), showScrollTop (boolean), activeSectionId
- `useEffect` — attach scroll event listener; compute thresholds; clean up on unmount
- `useRef` — refs to all section elements (for IntersectionObserver); last known scroll position (for direction)
- `useMemo` — no complex derivation needed — state is computed directly from scroll position
- `useCallback` — memoize scroll handler; memoize scroll-to-top handler
- Custom hook (`useStickyHeader`) — return `{ isCompact, showScrollTop, activeSectionId, scrollToTop }`

---

## Constraints

- Scroll event listener must be passive for performance.
- State must only update when crossing thresholds — use `useRef` to track last state and skip `setState` if unchanged.
- Active section detection must use `IntersectionObserver`, not scroll position math.
- Scroll-to-top must use `window.scrollTo({ top: 0, behavior: 'smooth' })`.

---

## Edge Cases to Consider

- User is at the very top — `showScrollTop` must be false; scroll-to-top button hidden.
- User scrolls up quickly past the 80px threshold — header must return to transparent immediately.
- Page has no sections (section refs array is empty) — active section must be null; no crashes.
- Multiple sections in the viewport simultaneously — highlight the topmost section.
- Header is inside an iframe — `window.scrollY` may behave differently; document the limitation.
- User resizes the browser, changing which section is "first" — IntersectionObserver recalculates automatically.
