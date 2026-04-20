# 40 — Theme Switcher with System Preference Detection

## Problem Statement

You are building a theme system for a SaaS dashboard that supports Light, Dark, and System (auto) modes. The theme preference is persisted to localStorage and applied as a CSS class on the root element. System mode automatically follows the OS preference using `prefers-color-scheme`. The theme switcher component (a 3-way toggle) is available in the app header. The selected theme is available throughout the component tree via context.

---

## Expected Behavior

- The app reads the saved theme preference from localStorage on init.
- If no saved preference, default to "System" mode.
- System mode applies `dark` class if the OS is dark, `light` class if the OS is light.
- Changing the OS preference while in System mode immediately updates the app theme (no reload).
- The 3-way toggle renders three options: Sun (Light), Monitor (System), Moon (Dark).
- Selecting a theme saves it to localStorage, updates the root element class, and notifies the context.
- Components consume `useTheme()` to get the current effective theme (`'light'` or `'dark'`).

---

## Required React Concepts

- `useState` — selected preference ('light' | 'dark' | 'system')
- `useEffect` — read localStorage on mount; attach `MediaQueryList.addEventListener('change', ...)` for system theme; apply class to `document.documentElement`
- `useRef` — store the MediaQueryList instance for cleanup
- `useContext` — provide theme preference and effective theme throughout the tree
- Custom hook (`useTheme`) — expose `{ preference, effectiveTheme, setPreference }` to consumers
- `useMemo` — derive the effective theme from preference and system preference

---

## Constraints

- CSS class must be applied to `document.documentElement` (the `<html>` element), not `<body>`.
- The MediaQueryList listener must be cleaned up on preference change (if no longer in System mode) and on unmount.
- No CSS-in-JS library. Theme is applied purely via a CSS class on the root element.
- Must not flash the wrong theme on initial load (avoid FOUC — Flash of Unstyled Content).

---

## Edge Cases to Consider

- localStorage is unavailable (private browsing) — fall back to System preference without crashing.
- System preference changes to dark while the user has Light mode selected — effective theme must not change.
- Multiple `useTheme()` consumers update simultaneously — must not cause a render cascade.
- Server-side rendering context — `window` and `localStorage` are not available; must guard access.
- User switches to System mode and OS is dark — class switches immediately; no delay.
- Tab becomes visible after OS switched themes in the background — must pick up the new system theme.
