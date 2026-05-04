# 112 — Redux Toolkit — Shopping Cart

## Problem Statement

Build a shopping cart using Redux Toolkit. A product catalogue on the left shows 6 products with quantity controls (+ / −). A cart summary panel on the right shows added items, quantity per item, line totals, grand total, and a "Clear Cart" button. All cart state lives in a Redux slice. No local React state is used for cart data.

---

## Expected Behavior

- Product grid: each product shows name, emoji, price, and +/− quantity buttons.
- Quantity buttons are disabled appropriately (− disabled at 0).
- Cart summary panel: lists only items with qty > 0.
- Each cart row: product name × quantity, line price.
- Footer: grand total.
- "Clear Cart" button resets all quantities to zero.
- Cart item count shown in the panel header e.g. "Cart (3)".
- All values formatted with 2 decimal places.

---

## Where to Start — Interview Approach

### Step 1: State shape
```js
// Store quantities by product id
initialState: { items: {} }
// items = { '1': 2, '3': 1 }  (product id → quantity)
```
Products themselves are static data — not stored in Redux.

### Step 2: Slice reducers
```js
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: {} },
  reducers: {
    addItem(state, { payload: id }) {
      state.items[id] = (state.items[id] ?? 0) + 1;
    },
    removeItem(state, { payload: id }) {
      if (state.items[id] > 1) state.items[id]--;
      else delete state.items[id];   // remove key entirely at 0
    },
    removeAll(state, { payload: id }) {
      delete state.items[id];
    },
    clearCart(state) {
      state.items = {};
    },
  },
});
```

### Step 3: Derive totals with useSelector
```js
const cartEntries = useSelector((s) =>
  Object.entries(s.cart.items)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({
      product: PRODUCTS.find((p) => p.id === Number(id)),
      qty,
      lineTotal: PRODUCTS.find((p) => p.id === Number(id)).price * qty,
    }))
);
const grandTotal = cartEntries.reduce((sum, e) => sum + e.lineTotal, 0);
```

### Step 4: Performance — selector stability
`Object.entries` in a selector creates a new array reference every time. Wrap with `createSelector` (re-export from RTK) to memoize:
```js
import { createSelector } from '@reduxjs/toolkit';
const selectCartEntries = createSelector(
  (s) => s.cart.items,
  (items) => Object.entries(items).filter(([, qty]) => qty > 0)
);
```

---

## Required Redux Toolkit APIs

- `createSlice` — cart slice with add/remove/clear reducers
- `configureStore` + `Provider` — store setup
- `useSelector` — read items map and derive display data
- `useDispatch` — dispatch addItem, removeItem, clearCart
- `createSelector` (bonus) — memoize derived cart data

---

## Constraints

- Product data (name, price, emoji) is static and must NOT be stored in Redux — only the `{ id: quantity }` map lives in the store.
- The `− ` button must be disabled when quantity is 0.
- `clearCart` must reset `items` to `{}`, not to an array.
- No `useState` for any cart-related data.

---

## Edge Cases to Consider

- Adding the same product multiple times — `state.items[id]` accumulates correctly.
- Removing an item that has quantity 1 — must `delete` the key rather than setting to 0, so the cart summary only shows items with qty > 0.
- Empty cart — "Cart (0)" header, empty summary list, grand total of $0.00.
- Floating-point arithmetic: `1.1 + 2.2 !== 3.3` in JS. Use `parseFloat(total.toFixed(2))` or format with `.toFixed(2)` at display time only.
- Product not found in PRODUCTS lookup — guard with optional chaining in case IDs get out of sync.
