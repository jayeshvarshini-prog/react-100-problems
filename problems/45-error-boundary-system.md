# 45 — Error Boundary System with Fallback UI and Reporting

## Problem Statement

You are building a robust error boundary system for a production SaaS dashboard. Individual widgets and page sections should be wrapped with error boundaries so that one crashing component does not bring down the entire app. The system must capture component errors, render a fallback UI with a retry button, and report errors to an external error tracking service (simulated). Error boundaries must support different fallback strategies: inline error (for widgets), full-page error (for routes), and silent suppression (for non-critical decorative components).

---

## Expected Behavior

- Any component wrapped in `<ErrorBoundary>` renders a fallback UI if it throws.
- The fallback UI type is determined by a `variant` prop: `'widget'` (small inline card), `'page'` (full-page error), `'silent'` (render nothing).
- The fallback shows the error message in development; a generic "Something went wrong" message in production.
- A "Try Again" button resets the error boundary state and re-renders the child component.
- Error details (component stack, error message) are sent to a mock error reporting endpoint on capture.
- A HOC `withErrorBoundary(Component, options)` wraps a component declaratively.

---

## Required React Concepts

- Class component (Error Boundary) — `getDerivedStateFromError` and `componentDidCatch` lifecycle methods (React error boundaries must be class components)
- `useEffect` — (in a wrapper functional component) call the reporting function when error state changes
- `useState` — reset key to force re-render on retry (pass as `key` to the class boundary)
- Custom hook (`useErrorHandler`) — for programmatic error throwing within functional components (throws into the nearest error boundary)
- HOC pattern (`withErrorBoundary`) — wrap any component with configurable error boundary

---

## Constraints

- The class-based ErrorBoundary must be minimal. All stateful logic (retry, reporting) must be driven from a functional parent via props.
- Retry must work by changing the `key` prop on the error boundary, causing a full remount of the child.
- Error reporting must be asynchronous and must not block the fallback UI from rendering.
- Silent variant must not log anything to the console in production.

---

## Edge Cases to Consider

- Error thrown during rendering of the fallback UI itself — must not infinite-loop; show a minimal hard-coded error.
- Same component throws repeatedly after retry — the boundary must catch each throw; do not let errors bubble infinitely.
- Error boundary around a Suspense boundary — React error propagation order must be considered.
- `componentDidCatch` receives a component stack — must sanitize before sending to the reporting service (may contain source file paths).
- Multiple nested error boundaries — error is caught by the nearest ancestor boundary, not the outermost.
- Error boundary key reset triggers a fetch in the child — loading states must reset cleanly.
