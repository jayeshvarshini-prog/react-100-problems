# How to Attack Any React Problem in an Interview

> Use this framework every time. Say it out loud. Interviewers reward structured thinking.

---

## The 5-Step Framework (say these steps before writing any code)

### Step 1 — Restate and Clarify (60 seconds)
Repeat the problem back in your own words. Ask:
- "Is this client-side only or does it talk to a real API?"
- "Should state persist on refresh?"
- "Is this a controlled or uncontrolled component?"
- "Any performance requirements — like 10,000 rows?"

This buys you thinking time and shows you think before you code.

---

### Step 2 — Identify the State Shape (2 minutes)
Ask yourself: **"What data changes over time in this UI?"**

Write out your state shape first — before touching JSX:

```
// What does the state look like?
{
  items: [],        // the data
  loading: false,   // async status
  error: null,      // failure case
  page: 1,          // pagination
  query: '',        // user input
}
```

Then ask: **"Does this belong in useState, useReducer, or context?"**

| Use `useState` when | Use `useReducer` when | Use `useContext` when |
|---|---|---|
| 1–3 independent values | Many related values | Shared across many components |
| Simple toggles | Complex transitions | Auth, theme, cart, permissions |
| Local UI state only | Multiple actions update the same state | Avoids deep prop drilling |

---

### Step 3 — Identify the Side Effects (1 minute)
Ask: **"What needs to happen as a reaction to state/prop changes?"**

Every `useEffect` answers ONE of these:
- Fetch data when X changes
- Subscribe to something (WebSocket, EventListener, IntersectionObserver) on mount
- Sync state to an external system (localStorage, URL, document title)
- Clean something up on unmount

Write the effect signatures before the implementation:
```js
useEffect(() => { /* fetch when page changes */ }, [page]);
useEffect(() => { /* attach resize listener */ }, []); // mount only
```

---

### Step 4 — Identify the Derived Data (1 minute)
Ask: **"What values can be COMPUTED from existing state instead of stored?"**

These become `useMemo`. Rule: if you find yourself writing `setState` inside a `useEffect` just to transform existing state, you should use `useMemo` instead.

```js
// BAD — storing derived state
const [filteredItems, setFilteredItems] = useState([]);
useEffect(() => { setFilteredItems(items.filter(...)); }, [items, query]);

// GOOD — derived with useMemo
const filteredItems = useMemo(() => items.filter(...), [items, query]);
```

---

### Step 5 — Identify the Performance Risks (1 minute)
Before writing handlers and child components, flag:

1. **What re-renders too often?** — wrap stable functions with `useCallback`
2. **What recomputes too often?** — wrap expensive derivations with `useMemo`
3. **What re-renders when it shouldn't?** — wrap child components with `React.memo`
4. **What causes layout thrash?** — use `useRef` instead of state for values that don't need to trigger renders

---

## The Mental Model: Data Flow

```
URL / External Store
        ↓
  Context (global shared state)
        ↓
  Component State (useReducer / useState)
        ↓
  Derived State (useMemo)
        ↓
  JSX (render)
        ↓
  Side Effects (useEffect) → API / DOM / Storage
```

When you get confused, trace where the data comes from and where it goes.

---

## Decision Trees

### "Which hook do I need?"

```
Does the value change over time?
  No → const (just a variable or useMemo)
  Yes →
    Does changing it need to re-render the component?
      No → useRef
      Yes →
        Is it derived from other state?
          Yes → useMemo
          No →
            Is it a complex object with many related sub-values?
              Yes → useReducer
              No → useState
```

### "Do I need useCallback?"

```
Am I passing a function to a child component?
  AND
Is that child wrapped in React.memo?
  OR
Is the function in a useEffect dependency array?
  → YES to either: use useCallback
  → NO to both: don't bother (it adds complexity without benefit)
```

### "Do I need useMemo?"

```
Is this computation:
  - Filtering/sorting a large array (> 1000 items)?
  - Running inside a frequently re-rendering component?
  - A deep object creation that causes reference equality to fail downstream?
  → YES to any: use useMemo
  → NO to all: don't bother (premature optimization adds noise)
```

---

## Performance Talking Points for Every Interview

When asked "how would you improve performance?", cycle through this list:

1. **Avoid unnecessary re-renders**
   - `React.memo` on child components that receive the same props often
   - `useCallback` for handlers passed as props
   - Split state: don't put frequently-changing values with slowly-changing values in the same state object

2. **Avoid expensive recalculations**
   - `useMemo` for filtering, sorting, or transforming large datasets
   - Move expensive calculations outside the component entirely (module level) if they don't depend on props/state

3. **Avoid unnecessary DOM work**
   - Virtualize long lists (only render visible rows)
   - Debounce or throttle event handlers (search, resize, scroll)
   - `useRef` for values that change frequently but don't need to trigger a render (animation frames, timer IDs)

4. **Avoid unnecessary network calls**
   - Deduplicate concurrent requests for the same resource
   - Cache results with a TTL
   - Debounce user input before firing API calls

5. **Code splitting and lazy loading**
   - `React.lazy` + `Suspense` for route-level code splitting
   - Lazy-load images with IntersectionObserver

---

## How to Start Coding — The Order That Works

```
1. Write the state shape (useState / useReducer)
2. Write the JSX skeleton (no logic yet — just structure)
3. Wire up the data display (render the state)
4. Add the data fetching (useEffect)
5. Add user interactions (event handlers)
6. Add derived/computed values (useMemo)
7. Add performance optimizations (useCallback, React.memo)
8. Handle loading, error, and empty states
9. Handle edge cases
```

This order guarantees you always have something working on screen. You build incrementally — never starting from a blank slate.

---

## What to Say When You're Stuck

- "Let me think about the state shape first."
- "I'm going to start with the basic render and add the logic layer by layer."
- "I'd normally reach for a custom hook here to keep this component clean."
- "This is a performance risk — let me flag it even if I implement the basic version first."
- "The edge case here would be if the user [X] — let me handle that after the happy path."

Saying these things out loud is 50% of a great interview performance.
