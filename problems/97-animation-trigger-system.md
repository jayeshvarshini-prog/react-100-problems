# 97 — Scroll-Triggered Animation System

## Problem Statement

You are building a scroll-triggered animation system for a SaaS marketing landing page. As the user scrolls down, sections animate into view (fade-in + slide-up). Each animatable element declares its animation type and delay via data attributes. The system uses IntersectionObserver to detect when elements enter the viewport and applies CSS animation classes. Animations should only fire once per element.

---

## Expected Behavior

- Any element with `data-animate="fade-up"` (or `"fade-in"`, `"slide-left"`, `"scale-in"`) animates when it enters the viewport.
- An optional `data-animate-delay="200"` adds a delay (ms) before the animation starts.
- Once an element has animated in, it is not re-animated on subsequent scrolls.
- The system initializes on mount, observes all `[data-animate]` elements, and disconnects the observer when all have animated.
- A `data-animate-threshold="0.2"` attribute configures how much of the element must be visible before animating.

---

## Required React Concepts

- `useEffect` — on mount, query all `[data-animate]` elements; set up IntersectionObserver; clean up on unmount
- `useRef` — reference to the IntersectionObserver instance; Set of already-animated element IDs
- `useCallback` — memoize the intersection callback function
- Custom hook (`useScrollAnimations`) — encapsulate observer setup and cleanup; call this once at the app root level

---

## Constraints

- Must use IntersectionObserver — no scroll event listeners.
- Once all elements on the page have animated, the observer must disconnect (no wasted observation).
- CSS animation classes must be added, not inline styles, to keep separation of concerns.
- Animation delay must be applied via inline `style.animationDelay` on the element, not a separate observer.
- No external animation libraries.

---

## Edge Cases to Consider

- Element is already in the viewport on page load (above the fold) — it should animate immediately on mount.
- Element is inside a container with `overflow: hidden` — IntersectionObserver may not detect it; document the limitation.
- Page with no `[data-animate]` elements — hook must initialize without errors.
- User has `prefers-reduced-motion: reduce` in their OS — must skip all animations (respect the media query).
- Elements added dynamically after mount (e.g., infinite scroll) — the observer must be able to observe them. Expose a `reobserve()` function.
- Same element scrolled out of view and back in — must not re-animate (each-once behavior).
