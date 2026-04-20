# 67 — Live Preview Email Template Editor

## Problem Statement

You are building an email template editor for a marketing automation SaaS. The left panel is a form where users configure template variables (subject, header text, body content, button label, button URL, footer text, brand color). The right panel renders a live HTML preview of the email template with the variables injected. The preview updates in real time (debounced 200ms). Users can send a test email to themselves.

---

## Expected Behavior

- All template variables are editable via form inputs on the left.
- The right panel shows an HTML email preview rendered in an `<iframe>` sandbox.
- The preview updates 200ms after any input change.
- A "Send Test Email" button at the top calls the API with the current template variables and the user's email.
- Validation: subject and body are required; button URL must be a valid URL if provided; brand color must be a valid hex code.
- Form errors are shown inline.
- A "Copy HTML" button copies the generated HTML to the clipboard.

---

## Required React Concepts

- `useState` — template variables object, validation errors, test email sending state
- `useEffect` — inject the rendered HTML into the iframe via `contentDocument.write()` when template changes (debounced 200ms)
- `useRef` — iframe element ref; debounce timer; last-rendered HTML for copy functionality
- `useMemo` — generate the full HTML string from the template and current variables; derive form validity
- `useCallback` — memoize field change handler, send test email handler, copy HTML handler

---

## Constraints

- The iframe must use the `sandbox` attribute to prevent script execution in the preview.
- Template HTML must be a static string with `{{variable}}` placeholders — no eval or dangerouslySetInnerHTML without sanitization.
- Brand color input must be both a color picker and a hex text input, kept in sync.
- No external email template builder libraries.

---

## Edge Cases to Consider

- User enters `<script>` in the body content — must be escaped before injection into the template HTML.
- Brand color input shows an invalid hex code mid-typing (e.g., "#FF") — do not apply it to the preview; wait for a valid 6-char hex.
- Iframe not yet mounted when the first preview update fires — must handle gracefully.
- "Send Test Email" API returns a rate limit error (too many test emails) — show a cooldown message.
- Template variables contain Unicode characters (e.g., Japanese subject line) — preview must render correctly.
- User pastes an extremely long body text — preview must scroll within the iframe, not expand the iframe height.
