# React Performance Patterns — Expert Reference

> Know these cold. In interviews, proactively mention performance risks before the interviewer asks.

---

## Pattern 1 — Prevent Unnecessary Re-renders with React.memo

**When:** A child component receives the same props on most parent re-renders.

```jsx
// WITHOUT memo: re-renders every time the parent re-renders
function ExpensiveRow({ item, onDelete }) {
  return <div onClick={() => onDelete(item.id)}>{item.name}</div>;
}

// WITH memo: only re-renders if item or onDelete reference changes
const ExpensiveRow = React.memo(function ExpensiveRow({ item, onDelete }) {
  return <div onClick={() => onDelete(item.id)}>{item.name}</div>;
});
```

**Gotcha:** `React.memo` does a shallow comparison. If you pass a new object/array literal as a prop, it will STILL re-render. Pair it with `useCallback` and `useMemo` for props.

---

## Pattern 2 — Stable Function References with useCallback

**When:** Passing a function to a `React.memo` child, or using a function in a `useEffect` dependency array.

```jsx
// BAD: new function reference on every render → defeats React.memo
function Parent() {
  const handleDelete = (id) => deleteItem(id); // new ref every render
  return <MemoizedChild onDelete={handleDelete} />;
}

// GOOD: stable reference
function Parent() {
  const handleDelete = useCallback((id) => deleteItem(id), []); // stable
  return <MemoizedChild onDelete={handleDelete} />;
}
```

**Interview line:** "I wrap this with useCallback because it's passed to a memoized child — without it, the memo has no effect."

---

## Pattern 3 — Expensive Derivations with useMemo

**When:** Computing a filtered/sorted/transformed list from large data, or building an object that's compared by reference downstream.

```jsx
// BAD: re-filters 10,000 items on every keystroke that changes ANY state
function ItemList({ items, query, theme }) {
  const filtered = items.filter(i => i.name.includes(query)); // runs every render

  return filtered.map(i => <Item key={i.id} item={i} theme={theme} />);
}

// GOOD: only re-filters when items or query changes
function ItemList({ items, query, theme }) {
  const filtered = useMemo(
    () => items.filter(i => i.name.includes(query)),
    [items, query] // theme changes do NOT trigger re-filter
  );

  return filtered.map(i => <Item key={i.id} item={i} theme={theme} />);
}
```

---

## Pattern 4 — Refs for Non-Rendering Values

**When:** A value changes frequently but does NOT need to cause a re-render (timer IDs, scroll positions, previous values, in-flight request refs).

```jsx
// BAD: every scroll event causes a re-render
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    window.addEventListener('scroll', () => setScrollY(window.scrollY));
  }, []);
}

// GOOD: scroll position tracked without re-renders
function ScrollTracker() {
  const scrollYRef = useRef(0);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      scrollYRef.current = window.scrollY;
      // Only setState for threshold crossings, not every pixel
      if (scrollYRef.current > 80 && !isCompact) setIsCompact(true);
    });
  }, []);
}
```

---

## Pattern 5 — Debounce to Limit Expensive Operations

**When:** User input (search, price calculators) triggers expensive work (API calls, re-renders).

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cleanup on every value change
  }, [value, delay]);

  return debouncedValue;
}

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]); // only fires 400ms after typing stops
}
```

**Interview tip:** Always mention debounce when you see a text input that drives API calls.

---

## Pattern 6 — List Virtualization for Large Datasets

**When:** Rendering more than ~100 items in a scrollable list.

**Concept:** Only render the rows visible in the viewport plus a small overscan buffer.

```jsx
function useVirtualList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 3);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + 3
    );
    return {
      items: items.slice(startIndex, endIndex),
      offsetY: startIndex * itemHeight,
      totalHeight: items.length * itemHeight,
    };
  }, [items, scrollTop, itemHeight, containerHeight]);

  return { ...visibleItems, onScroll: e => setScrollTop(e.target.scrollTop) };
}
```

**Interview line:** "For this list, I'd virtualize it — only render what's visible. With 10,000 rows, rendering them all would be ~100ms of DOM work."

---

## Pattern 7 — State Colocation to Prevent Cascading Re-renders

**When:** State that only affects one subtree is lifted too high, causing unrelated components to re-render.

```jsx
// BAD: tooltip state in the root causes the entire app to re-render
function App() {
  const [tooltip, setTooltip] = useState(null); // unnecessary at root
  return (
    <>
      <HeavyDashboard />  {/* re-renders when tooltip changes */}
      <Button onHover={setTooltip} />
    </>
  );
}

// GOOD: tooltip state lives in the component that needs it
function Button() {
  const [tooltip, setTooltip] = useState(null); // colocated
  return <button onMouseEnter={() => setTooltip('...')} />;
}

function App() {
  return (
    <>
      <HeavyDashboard />  {/* no longer re-renders for tooltip */}
      <Button />
    </>
  );
}
```

---

## Pattern 8 — Context Splitting to Avoid Over-Subscription

**When:** A context value has both frequently-changing and rarely-changing parts; consumers that only need the stable part re-render unnecessarily.

```jsx
// BAD: every component using this context re-renders when notifications change
const AppContext = createContext({ user, permissions, notifications });

// GOOD: split into separate contexts
const AuthContext = createContext({ user, permissions }); // rarely changes
const NotificationsContext = createContext({ notifications }); // changes often

// Component that only needs auth won't re-render on notification updates
function NavItem() {
  const { permissions } = useContext(AuthContext); // isolated subscription
}
```

---

## Pattern 9 — Request Deduplication

**When:** Multiple components mount simultaneously and all trigger the same API call.

```jsx
const inFlightRequests = new Map(); // module-level, shared across instances

async function fetchWithDedup(url) {
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url); // return the SAME promise
  }
  const promise = fetch(url).then(r => r.json()).finally(() => {
    inFlightRequests.delete(url);
  });
  inFlightRequests.set(url, promise);
  return promise;
}
```

**Interview line:** "If 10 components mount and all need the same data, I deduplicate the request at the fetch layer so only one network call goes out."

---

## Pattern 10 — Optimistic Updates

**When:** User actions have a near-certain success rate (like, follow, toggle). Don't make the user wait for the server.

```jsx
function useLike(initialLiked, initialCount) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const prevRef = useRef({ liked: initialLiked, count: initialCount });

  const toggle = useCallback(async () => {
    // Snapshot current state for revert
    prevRef.current = { liked, count };

    // Optimistic update BEFORE API call
    setLiked(l => !l);
    setCount(c => liked ? c - 1 : c + 1);

    try {
      await toggleLikeAPI();
    } catch {
      // Revert to snapshot on failure
      setLiked(prevRef.current.liked);
      setCount(prevRef.current.count);
      showErrorToast();
    }
  }, [liked, count]);

  return { liked, count, toggle };
}
```

---

## Pattern 11 — useReducer for Complex State Machines

**When:** You have ≥3 pieces of state that transition together in response to the same actions.

```jsx
// BAD: 4 useState calls that must always change together
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);
const [status, setStatus] = useState('idle');

// GOOD: one reducer, one dispatch
const initialState = { status: 'idle', data: null, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START': return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS': return { status: 'success', data: action.payload, error: null };
    case 'FETCH_ERROR': return { status: 'error', data: null, error: action.payload };
    default: return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
```

---

## Pattern 12 — Abort In-Flight Requests on Cleanup

**When:** A component that fetches data on prop changes. Without cleanup, a stale response can overwrite fresh data.

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/items?q=${query}`, { signal: controller.signal })
    .then(r => r.json())
    .then(data => setData(data))
    .catch(err => {
      if (err.name === 'AbortError') return; // expected — ignore
      setError(err);
    });

  return () => controller.abort(); // cancel when query changes or component unmounts
}, [query]);
```

---

## Performance Interview Checklist

When you finish implementing, always say:

> "Let me do a quick performance pass."

Then verbally check:

- [ ] Are any large arrays filtered/sorted on every render? → `useMemo`
- [ ] Are handlers passed to child components? → `useCallback` + `React.memo`
- [ ] Does this list have > 100 items? → Virtualization
- [ ] Does this input drive API calls? → Debounce
- [ ] Do multiple components need the same data on mount? → Request deduplication
- [ ] Are context values stable? → Split context or memoize the value
- [ ] Is any non-render state stored in `useState`? → Move to `useRef`
- [ ] Are effects cleaned up on unmount? → `AbortController`, `clearTimeout`, `removeEventListener`
