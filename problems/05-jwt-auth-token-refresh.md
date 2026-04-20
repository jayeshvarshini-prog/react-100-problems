# 05 — JWT Authentication Flow with Silent Token Refresh

## Problem Statement

You are implementing the authentication layer for a React SPA. The app uses JWT access tokens (short-lived, 15 minutes) and refresh tokens (long-lived, 7 days). On login, both tokens are stored. Every API request must attach the access token in the Authorization header. When an API call returns a 401, the app must silently refresh the access token using the refresh token, then retry the original request. If the refresh also fails (expired or revoked), the user must be logged out and redirected to the login page. All protected routes must redirect unauthenticated users to login.

---

## Expected Behavior

- Login form posts credentials to `/api/auth/login` and stores the returned tokens.
- A custom `fetch` wrapper (or Axios interceptor) attaches the access token to every request.
- On 401 response, the wrapper pauses the original request, calls `/api/auth/refresh`, updates the stored token, and retries the original request.
- Multiple simultaneous requests hitting 401 must all wait for a single refresh call, not each trigger their own refresh.
- On successful refresh, all queued requests resume with the new token.
- If refresh fails, all queued requests are rejected, and the user is logged out.
- Protected route components must redirect unauthenticated users to `/login`.

---

## Required React Concepts

- `useState` — auth state (user object, tokens, loading, error)
- `useEffect` — bootstrap auth on app load by reading stored tokens; set up token expiry timer
- `useContext` — provide auth state and actions (login, logout, refreshToken) throughout the app tree
- `useRef` — hold the refresh-in-progress promise so concurrent 401s share one refresh call
- Custom hook (`useAuth`) — expose auth context values with a clean API to consuming components

---

## Constraints

- Store access token in memory (a module-level variable or context), not localStorage.
- Store refresh token in an httpOnly cookie (simulate this — do not store in JS-accessible storage).
- The refresh queue mechanism must prevent multiple simultaneous refresh calls.
- All token handling logic must live in a single custom hook/context, not scattered in components.

---

## Edge Cases to Consider

- App loads with a valid refresh token but expired access token — should silently refresh before first API call.
- Two components mount simultaneously and both fire API calls that get 401 — only one refresh request should go out.
- Refresh token is expired on app load — user must see login page, not a broken app.
- User logs out in another tab — current tab should detect this (via storage event) and also log out.
- Access token expires exactly during a multi-request workflow — all requests in the workflow should succeed after one refresh.
- Login form submitted while already logged in — handle gracefully.
