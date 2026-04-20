# 07 — Shopping Cart with Persistence and Quantity Management

## Problem Statement

You are building the shopping cart system for an e-commerce storefront. Users can add products to the cart from product listing and product detail pages. The cart supports quantity adjustment, item removal, and coupon code application. The cart state must persist across page refreshes using localStorage. A cart icon in the navigation header shows the current item count. A slide-out cart drawer shows the full cart contents with a checkout button.

---

## Expected Behavior

- Clicking "Add to Cart" on any product adds it to the cart. If the item already exists, increment its quantity.
- The cart icon badge in the nav updates immediately to reflect total item count.
- The cart drawer can be opened/closed. It shows all cart items with quantity controls (+/-) and a remove button.
- Adjusting quantity to 0 via the minus button removes the item.
- A coupon code input validates against a mock API and applies a percentage discount.
- Order subtotal, discount, and total are computed and displayed.
- Cart state is loaded from localStorage on app init and saved on every change.

---

## Where to Start — Interview Approach

### Step 1: State shape first
The cart is a global resource used on multiple pages — it belongs in a Context + useReducer:
```
// In CartContext
{
  items: [{ productId, name, price, quantity, imageUrl }],
  coupon: null,         // { code, discountPercent }
  drawerOpen: false,
}
```

### Step 2: Identify the reducer actions
Map every user action to a reducer action before coding:
```
ADD_ITEM        — add or increment
REMOVE_ITEM     — remove by productId
UPDATE_QUANTITY — set quantity; dispatch REMOVE_ITEM if qty = 0
APPLY_COUPON    — set coupon object
CLEAR_CART      — reset to initial state
TOGGLE_DRAWER   — open/close cart drawer
LOAD_FROM_STORAGE — hydrate state on app init
```

### Step 3: Identify derived values (useMemo, not state)
```
subtotal     = sum(item.price × item.quantity)
discount     = coupon ? subtotal × (coupon.discountPercent / 100) : 0
total        = subtotal - discount
itemCount    = sum(item.quantity)   ← shown in badge
```
None of these should be stored in state — they're always derived.

### Step 4: Component skeleton order
```
1. CartContext.js — createContext, CartProvider with useReducer
2. useCart.js — custom hook that wraps useContext(CartContext)
3. CartProvider useEffect — load from localStorage on mount, save on every state change
4. AddToCart button — calls useCart().addItem(product)
5. CartIcon — calls useCart() and shows itemCount
6. CartDrawer — renders items, quantity controls, coupon input, total
```

---

## Required React Concepts

- `useReducer` — manage cart state (items array, coupon, discount) with explicit actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, APPLY_COUPON, CLEAR_CART
- `useContext` — provide cart state and dispatch throughout the component tree via a CartContext
- `useEffect` — sync cart state to localStorage on every change; load from localStorage on mount
- `useMemo` — derive subtotal, discount amount, and total from items array and coupon state
- `useCallback` — memoize dispatch-based action creators (addItem, removeItem, updateQty)

---

## Constraints

- Cart context must be a custom provider component wrapping the app.
- Consumers must use a `useCart` custom hook, not raw `useContext`.
- localStorage read/write must be wrapped in try/catch (quota exceeded, private browsing).
- No external state management library.

---

## Performance Notes

| Risk | Solution |
|---|---|
| Every `useCart` consumer re-renders when any part of cart changes | Split context: `CartStateContext` + `CartDispatchContext` (dispatch never changes) |
| Subtotal/total recalculated on every render | `useMemo` with `[items, coupon]` deps |
| `addItem`, `removeItem` functions recreated on every dispatch | `useCallback` wrapping the dispatchers |
| CartDrawer renders all items even when drawer is closed | Conditionally mount the drawer content only when `drawerOpen` is true |

**Interview talking point:** "The biggest performance win here is splitting the context into state and dispatch. Components that only call `addItem` (like product cards) subscribe only to dispatch — they never re-render when cart state changes."

```jsx
// Context split example
const CartStateContext = createContext();
const CartDispatchContext = createContext();

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // dispatch is stable — CartDispatchContext consumers never re-render on state changes
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
}
```

---

## Edge Cases to Consider

- Adding a product with quantity 0 in stock — should be prevented (button disabled, no state change).
- Coupon code validation returns a 404 — show "Invalid coupon" error without clearing the input.
- localStorage is full (QuotaExceededError) — fail silently, continue with in-memory state.
- Same product added from two different pages in quick succession — must not create duplicate entries.
- Cart loaded from localStorage contains a product that is now out of stock — flag that item visually.
- Applying a 100% coupon — total should be $0.00, not negative.
- Cart cleared while drawer is open — drawer should show empty state immediately.
