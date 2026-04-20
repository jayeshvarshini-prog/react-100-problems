# 11 — Virtual Scrolling List

## Problem Statement

You are building a contacts list for a CRM application that can contain up to 100,000 records. Rendering all records at once causes the browser to freeze. You must implement a virtualized list that only renders the rows currently visible in the viewport (plus a small overscan buffer), while maintaining correct scroll position and total scroll height as if all rows were rendered.

---

## Expected Behavior

- The list container has a fixed height and `overflow-y: scroll`.
- A spacer element at the top and bottom simulates the height of off-screen rows.
- Only the rows visible in the viewport (plus ~5 rows overscan above and below) are rendered in the DOM.
- Scrolling smoothly updates which rows are in the DOM without layout shift.
- Each row has a fixed height (configurable via prop, default 48px).
- Clicking a row opens a detail panel on the right side of the screen.
- A search input filters the visible list; the list re-virtualizes based on the filtered array.

---

## Where to Start — Interview Approach

### Step 1: Understand what "virtual" means in this context
The DOM only holds ~20 rows at any time, but the scrollbar behaves as if all 100,000 exist.
Achieved by:
- A tall wrapper div (`height = items.length × itemHeight`) — creates the scroll space
- A transform/padding on the inner container to offset rendered rows to their correct position
- Swapping out which rows are in the DOM as scrollTop changes

### Step 2: The math you need to know
```
startIndex = Math.floor(scrollTop / itemHeight) - overscan
endIndex   = Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
offsetY    = startIndex * itemHeight  // how far down to push the visible slice
totalHeight = items.length * itemHeight  // height of the invisible spacer
```

### Step 3: State vs Ref decision
`scrollTop` changes 60 times/second during scrolling. If stored in `useState`, that's 60 re-renders/second.

Solution: store `scrollTop` in `useRef` for the raw value; only call `setState` when the visible range of rows actually changes (check if startIndex or endIndex has changed before updating state).

```
scrollTop changes → handler fires →
  compute new startIndex/endIndex →
  SAME as before? → skip setState →
  DIFFERENT from before? → setState with new slice
```

### Step 4: Component skeleton order
```
1. Refs: containerRef (the scrollable div), scrollTopRef (latest scrollTop)
2. State: visibleRange { startIndex, endIndex }
3. useMemo: filteredItems from items + search query
4. useMemo: visible rows slice from filteredItems + visibleRange
5. useCallback: scroll handler → reads scrollTopRef, computes range, conditionally setState
6. useEffect: attach scroll listener; initial range calculation on mount
7. JSX: outer div (totalHeight) → inner div (translateY offsetY) → visible rows
```

---

## Required React Concepts

- `useState` — scroll top position, selected row
- `useEffect` — attach scroll event listener to the list container; clean up on unmount
- `useRef` — reference to the scrollable container element; store latest scroll position without triggering re-renders
- `useMemo` — derive the slice of visible rows from the full array based on scroll position and row height
- `useCallback` — memoize the scroll handler
- Custom hook (`useVirtualList`) — accept `items`, `itemHeight`, and `containerHeight`; return `visibleItems`, `totalHeight`, `offsetY`

---

## Constraints

- No external virtualization libraries (no react-window, react-virtual, etc.).
- Row height is uniform (variable height is out of scope).
- Must support keyboard navigation (Arrow Up/Down scrolls and moves selection; Home/End jump to first/last).
- The scroll event handler must be passive and must use `requestAnimationFrame` for DOM updates.

---

## Performance Notes

| Risk | Solution |
|---|---|
| `setState` called on every scroll event (60fps) | Use `useRef` for scrollTop; only `setState` when the visible row range changes |
| 100,000 items filtered on every render | `useMemo([items, query])` for the filtered array |
| All 100,000 rows in the DOM | Virtual rendering — only ~20 rows in DOM at any time |
| Scroll handler blocks the main thread | Passive event listener + `requestAnimationFrame` |
| Row components re-render when unrelated state changes | `React.memo` on the row component |

**Interview talking point:** "Naive rendering of 100,000 rows creates 100,000 DOM nodes — the browser will spend ~500ms just on layout. With virtualization, we keep ~20 nodes in the DOM regardless of list size. The scroll handler is the performance-critical path: I avoid calling setState on every scroll pixel by checking whether the visible range has actually changed."

```jsx
// The key insight — don't setState on every scroll event
const scrollHandler = useCallback(() => {
  const newStart = Math.max(0, Math.floor(containerRef.current.scrollTop / itemHeight) - OVERSCAN);
  const newEnd = /* ... */;

  // Only re-render when the visible slice changes
  if (newStart !== visibleRangeRef.current.start || newEnd !== visibleRangeRef.current.end) {
    visibleRangeRef.current = { start: newStart, end: newEnd };
    setVisibleRange({ startIndex: newStart, endIndex: newEnd });
  }
}, [itemHeight]);
```

---

## Edge Cases to Consider

- List filtered to 0 results — empty state, no virtualization calculation errors.
- Container height changes (window resize) — must recalculate visible rows.
- Initial scroll position (user navigates back) — must restore scroll to the previously selected row.
- Very fast scroll (flick) — overscan buffer must prevent blank rows from being visible.
- Items array changes length (filter applied) — scroll position must reset to top.
- Row count drops below what fits in the container — spacer heights must not go negative.
