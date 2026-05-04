# 123 — Axios Interceptors: 401 Token Refresh

## Problem Statement

Build an Axios instance with request and response interceptors. The request interceptor attaches a `Bearer` token from localStorage to every request. The response interceptor catches 401 errors, attempts to refresh the token via a refresh endpoint, and retries the original request once with the new token. If the refresh also fails, redirect the user to the login page.

---

## Expected Behavior

- Every outgoing request automatically gets `Authorization: Bearer <token>` header.
- If any response returns 401, the interceptor silently refreshes the token and retries the original request.
- The original caller (the component) receives the retried response as if nothing happened.
- If refresh fails (refresh token also expired), the user is redirected to `/login`.
- Only one refresh call is made even if multiple requests 401 simultaneously (queue pattern).

---

## Required Concepts

- `axios.create()` — custom Axios instance
- `instance.interceptors.request.use(config => ...)` — attach token
- `instance.interceptors.response.use(null, async error => ...)` — handle errors
- `error.config` — the original request config, used to retry
- Promise queue pattern — hold failed requests while refresh is in-flight

---

## Constraints

- The refresh endpoint must only be called once even if 3 requests 401 at the same time.
- After refresh, all queued requests must be retried with the new token.
- Do not modify every individual API call to handle 401 — it must be handled centrally in the interceptor.

---

## Edge Cases to Consider

- What if the refresh endpoint itself returns 401 — infinite loop risk.
- What if the user logs out while a refresh is in-flight?
- How do you prevent the interceptor from intercepting the refresh call itself?
