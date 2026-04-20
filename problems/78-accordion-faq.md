# 78 — Accordion FAQ Component with Search and Deep Linking

## Problem Statement

You are building an FAQ page for a SaaS help center. The FAQ is organized into sections (Billing, Account, Integrations, API). Each section contains multiple Q&A items in an accordion. A search input filters items across all sections. A specific FAQ item can be deep-linked via URL hash (`#billing-payment-methods`). Opening one item in a section optionally closes others (exclusive mode).

---

## Expected Behavior

- All FAQ sections and their items are rendered on page load (no lazy loading).
- Clicking a FAQ item expands it with an animated height transition. Clicking again collapses it.
- In exclusive mode (one-at-a-time), opening one item closes the currently open one in the same section.
- A search input at the top filters items by question text (case-insensitive). Non-matching items are hidden; their section headings hide if all items are hidden.
- If a URL hash matches a FAQ item ID on page load, that item auto-expands and scrolls into view.
- Each item has a "Copy Link" button that copies the direct URL with hash to clipboard.

---

## Required React Concepts

- `useState` — open items set (for multi-open mode) or one open item per section Map (for exclusive mode); search query
- `useEffect` — on mount, parse URL hash and expand the matching item; scroll it into view
- `useRef` — reference to each item's content div for CSS height animation; item element refs for scroll-into-view
- `useMemo` — derive filtered items and sections from the search query; derive item IDs from questions
- `useCallback` — memoize toggle handlers, copy-link handler

---

## Constraints

- Height animation must be CSS-based: set `max-height` to the scrollHeight of the content div when expanding (not a fixed value).
- No external accordion libraries.
- Exclusive mode must be configurable per-section via a prop.
- Deep link must work even if the item is inside a section that is visually collapsed.

---

## Edge Cases to Consider

- URL hash points to an item that doesn't exist — must scroll to top gracefully.
- Search returns 0 results — show "No FAQ items match your search" message.
- Search while an item is expanded — the item should remain expanded if it matches; collapse if it doesn't.
- Item content contains links — clicking links inside the expanded content must not toggle the accordion.
- Animated collapse: item is closing (transitioning) when user clicks it again to open — must handle mid-animation interaction.
- Content height changes after initial open (e.g., embedded image loads) — height animation must account for this.
