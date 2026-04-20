# 38 — Resizable Split Panel Layout

## Problem Statement

You are building a resizable two-panel layout for a code review tool. The left panel shows a file tree; the right panel shows the selected file's diff. Users can drag the divider between the two panels to resize them. The panel widths are saved to localStorage so they persist across sessions. The layout must support both horizontal split (side-by-side) and vertical split (top-bottom). Panels have minimum width/height constraints.

---

## Expected Behavior

- The divider between panels is draggable. Dragging it resizes both panels simultaneously.
- While dragging, a resize cursor is shown over the entire page (not just the divider).
- Panels cannot be resized below their minimum size (configurable, default 15% of the container).
- Releasing the mouse commits the size and saves it to localStorage.
- A "Reset to 50/50" button resets the split to equal halves.
- The layout supports `direction="horizontal"` (left/right panels) and `direction="vertical"` (top/bottom panels).
- On window resize, panel sizes recalculate as percentages to maintain their ratio.

---

## Required React Concepts

- `useState` — split ratio (percentage for the first panel)
- `useEffect` — load saved ratio from localStorage on mount; save on change; clean up mouse event listeners
- `useRef` — divider element ref; container element ref (for measuring total width/height during drag)
- `useCallback` — memoize mousedown (drag start), mousemove (drag), mouseup (drag end) handlers
- Custom hook (`useResizablePanel`) — encapsulate all drag logic; return `{ ratio, dividerProps, resetRatio }`

---

## Constraints

- Drag listeners (`mousemove`, `mouseup`) must be attached to the `document`, not the divider, to avoid losing the drag when mouse moves fast.
- Sizes must be stored as percentages, not pixels, for responsive behavior.
- Must apply `user-select: none` to the document during drag to prevent text selection.
- No external resizable panel libraries.

---

## Edge Cases to Consider

- User drags beyond the minimum size — clamp to the minimum, not zero.
- User drags to exactly 50% — "Reset" button should have no visible effect.
- Container width is 0 on mount (hidden panel) — must handle without NaN percentages.
- localStorage value is corrupt or out of range — fall back to 50%.
- Divider double-click — optional: reset to 50/50 on double-click.
- Touch devices — `touchmove`/`touchend` equivalents must also work.
- Both panels have content that overflows — each panel must scroll independently.
