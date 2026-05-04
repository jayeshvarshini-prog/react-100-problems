# 111 — Redux Toolkit — Counter Slice

## Problem Statement

Build a counter using Redux Toolkit. Define a `counterSlice` with `createSlice` that supports increment, decrement, reset, increment-by-amount, and undo (revert to previous value). Wire it to a component using `useSelector` and `useDispatch`. The step size must be configurable from the UI. Show the last 8 values in a history trail below the counter.

---

## Expected Behavior

- A large counter value display in the centre.
- Three buttons: −, Reset, +
- A number input to set the step (default 1). Increment/Decrement use this step.
- An "Undo" button that reverts to the value before the last action. Shows count of undo-able steps.
- History trail of the last 8 values shown as: `0 → 5 → 10 → 15`
- All state (value, step, history) lives inside the Redux slice — zero local React state.

---

## Where to Start — Interview Approach

### Step 1: Define the slice
```js
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0, step: 1, history: [] },
  reducers: {
    increment(state) {
      state.history.push(state.value);  // Immer lets you mutate directly
      state.value += state.step;
    },
    decrement(state) {
      state.history.push(state.value);
      state.value -= state.step;
    },
    reset(state) {
      state.history.push(state.value);
      state.value = 0;
    },
    setStep(state, action) {
      state.step = action.payload;
    },
    undo(state) {
      if (state.history.length > 0) {
        state.value = state.history.pop();
      }
    },
  },
});
```

### Step 2: Configure store
```js
const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});
```
Create the store once in module scope — not inside the component.

### Step 3: Wire to React
```js
function Counter() {
  const { value, step, history } = useSelector((s) => s.counter);
  const dispatch = useDispatch();
  // dispatch(counterSlice.actions.increment())
}

// Wrap with Provider in the default export
export default () => (
  <Provider store={store}>
    <Counter />
  </Provider>
);
```

### Step 4: Immer under the hood
RTK uses Immer in reducers — you can write `state.value += 1` instead of returning a new object. This is why the mutations are safe.

---

## Required Redux Toolkit APIs

- `createSlice` — defines name, initialState, and reducers in one call
- `configureStore` — creates the store; automatically sets up Redux DevTools
- `Provider` (from react-redux) — makes the store available to the component tree
- `useSelector` — read state from the store
- `useDispatch` — get the dispatch function
- `action.payload` — the argument passed to `dispatch(setStep(5))` arrives as `action.payload`

---

## Key RTK Concepts to Know for Interviews

| Concept | What it does |
|---|---|
| Immer integration | Lets you write "mutating" reducer logic that produces immutable updates |
| Slice | Groups name + initialState + reducers; auto-generates action creators |
| `configureStore` | Replaces `createStore`; enables Redux DevTools automatically |
| `action.payload` | Conventional field for the data passed to an action |

---

## Constraints

- All state (value, step, history) must be in the Redux slice — no `useState` inside the component.
- Store must be created outside the component.
- Wrap the component with `<Provider store={store}>` inside the default export.
- Undo must pop from `history` — do not re-derive history from an action log.

---

## Edge Cases to Consider

- Undo with empty history — button must be disabled; reducer must guard with `if (state.history.length > 0)`.
- Step of 0 — counter doesn't move; valid but consider showing a warning.
- Negative step — allows counting down with the + button and up with −; decide if this is intended behavior.
- History grows indefinitely — in production you'd cap it; for this problem keep all entries and display only the last 8 in the UI.
