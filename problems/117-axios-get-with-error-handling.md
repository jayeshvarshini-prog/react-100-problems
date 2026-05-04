# 117 — Axios GET with Structured Error Handling

## Problem Statement

Build a post viewer that fetches a post by ID from `https://jsonplaceholder.typicode.com/posts/{id}`. The user can enter any post ID in an input and click "Fetch". Use Axios for the request. Display different UI states for: loading, success, 404 not found, other HTTP errors, and network failure.

---

## Expected Behavior

- User types a post ID and clicks Fetch.
- A spinner shows while the request is in-flight.
- On success, post title and body are shown.
- On 404, show "Post not found."
- On other HTTP errors (5xx), show "Server error, try again later."
- On network failure (no internet), show "Network error — check your connection."
- Each new Fetch clears the previous result and shows the spinner again.

---

## Required Concepts

- `axios.get()` with `async/await` and `try/catch`
- `axios.isAxiosError()` to distinguish Axios errors from generic JS errors
- `error.response` — exists for HTTP errors (4xx, 5xx)
- `error.request` — exists when request was made but no response received (network failure)
- `useState` — data, loading, errorType

---

## Constraints

- Use Axios, not `fetch`.
- Distinguish at minimum three error categories: not found (404), server error (5xx), network failure.
- Do not show a raw stack trace or error object to the user.

---

## Edge Cases to Consider

- What if the user changes the input while a request is in-flight and clicks Fetch again?
- What if post ID 0 or a negative number is entered?
- Axios throws on any non-2xx response — make sure your catch handles this, not just network errors.
