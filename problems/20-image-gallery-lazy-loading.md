# 20 — Image Gallery with Lazy Loading and Lightbox

## Problem Statement

You are building the media gallery for a content management system. The gallery displays a masonry grid of images. Images are lazy-loaded (only fetched when they enter the viewport). Clicking an image opens a fullscreen lightbox with previous/next navigation. The lightbox supports keyboard navigation and swipe gestures on mobile. Images are loaded progressively: a blurred low-quality placeholder is shown until the full image loads.

---

## Expected Behavior

- Images below the fold are not loaded until they scroll into the viewport (using IntersectionObserver).
- Each image slot shows a blurred placeholder (base64 or low-res URL) while the full image loads.
- Once the full image loads, it fades in over the placeholder.
- Clicking an image opens the lightbox, displaying the full-resolution version.
- In the lightbox, left/right arrow buttons and Arrow Left/Right keyboard keys navigate between images.
- The lightbox closes on Escape key or clicking the backdrop.
- The lightbox displays the current image index ("3 / 24").

---

## Required React Concepts

- `useState` — active lightbox index (null if closed), per-image loaded state
- `useEffect` — attach IntersectionObserver for each image; trap focus in lightbox; keyboard listeners
- `useRef` — array of refs for each image element (for IntersectionObserver); lightbox container ref
- `useCallback` — memoize observer callback, lightbox navigation handlers
- `useMemo` — derive prev/next indices with wrapping
- Custom hook (`useLazyImage`) — accept `src` and `placeholder`; return `{ ref, displaySrc, isLoaded }`

---

## Constraints

- No external lazy loading or lightbox libraries.
- IntersectionObserver must be used — no scroll event listeners for lazy loading.
- Observer must be disconnected for each image after it loads (no memory leak).
- Images must have correct `alt` attributes (passed as prop).
- Lightbox must trap focus (tab must not leave the lightbox while open).

---

## Edge Cases to Consider

- Image fails to load — show a broken image placeholder, do not show the blurred placeholder indefinitely.
- IntersectionObserver not supported (old browser) — fall back to loading all images immediately.
- Gallery has 1 image — lightbox should not show prev/next buttons.
- Very fast scroll — multiple images enter viewport simultaneously; all should load without conflict.
- Lightbox open while gallery is re-filtered — if the currently displayed image is removed from the filtered set, close the lightbox.
- Lightbox index at last image and user presses next — should wrap to first image.
