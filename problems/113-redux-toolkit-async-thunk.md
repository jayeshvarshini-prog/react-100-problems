# 113 — Redux Toolkit — createAsyncThunk

## Problem Statement

Build a user list that fetches data asynchronously using Redux Toolkit's `createAsyncThunk`. The slice must handle all three async lifecycle actions: `pending` → `fulfilled` → `rejected`. Show distinct UI for each state: a loading indicator, an error message with a Retry button, and the user list. Clicking a user triggers a second `createAsyncThunk` that fetches user detail and shows it in a side panel. Simulate a 20% chance of failure to demo the rejected path.

---

## Expected Behavior

- "Fetch Users" button triggers `fetchUsers` thunk.
- Status transitions: idle → loading → succeeded or failed.
- Loading: spinner text.
- Failed: error message + "Retry" button (re-dispatches the same thunk).
- Succeeded: user cards, each clickable.
- Clicking a user dispatches `fetchUserById` — detail panel shows name, username, email, company.
- A "Close" button in the detail panel dispatches a synchronous `clearSelected` action.

---

## Where to Start — Interview Approach

### Step 1: createAsyncThunk
```js
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    await delay(1000);
    if (Math.random() < 0.2) return rejectWithValue('Network error');
    return MOCK_USERS;
  }
);
```
- First arg: action type prefix string (e.g., `'users/fetchAll'`).
- RTK auto-generates three action types: `users/fetchAll/pending`, `/fulfilled`, `/rejected`.
- Use `rejectWithValue` to pass a custom error payload (instead of the default Error object serialization).

### Step 2: Slice with extraReducers
```js
const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {
    clearSelected(state) { state.selected = null; }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending,    (state)           => { state.status = 'loading'; state.error = null; })
      .addCase(fetchUsers.fulfilled,  (state, { payload }) => { state.status = 'succeeded'; state.list = payload; })
      .addCase(fetchUsers.rejected,   (state, { payload }) => { state.status = 'failed'; state.error = payload; });
  },
});
```

### Step 3: Dispatch in the component
```js
const dispatch = useDispatch();
const { list, status, error } = useSelector((s) => s.users);

<button onClick={() => dispatch(fetchUsers())}>Fetch Users</button>
```

### Step 4: Status-driven UI
```js
if (status === 'idle')      return <IdleView />;
if (status === 'loading')   return <Spinner />;
if (status === 'failed')    return <ErrorView error={error} onRetry={() => dispatch(fetchUsers())} />;
if (status === 'succeeded') return <UserList />;
```

---

## Required Redux Toolkit APIs

- `createAsyncThunk(typePrefix, payloadCreator)` — generates pending/fulfilled/rejected action creators
- `rejectWithValue` — pass custom error data in the rejected action's `payload`
- `extraReducers` with `builder.addCase` — handle async lifecycle actions
- Status string pattern: `'idle' | 'loading' | 'succeeded' | 'failed'`

---

## Key Interview Points

| Concept | Detail |
|---|---|
| Auto-generated action types | `thunk.pending`, `thunk.fulfilled`, `thunk.rejected` |
| `rejectWithValue` | Makes `action.payload` the custom value; without it, `action.error` is a serialized Error |
| `extraReducers` vs `reducers` | `reducers` = sync actions defined by the slice. `extraReducers` = responds to actions from other slices or thunks |
| Retry pattern | Simply dispatch the thunk again — it goes through the full pending→fulfilled/rejected cycle |

---

## Constraints

- Use `extraReducers` with the `builder` pattern (not the legacy map notation).
- Use `rejectWithValue` to pass the error string — not `throw new Error(...)`.
- The `status` field must follow the `'idle' | 'loading' | 'succeeded' | 'failed'` pattern.
- No `isLoading` boolean — derive all UI from `status`.

---

## Edge Cases to Consider

- Retry while a fetch is already in-flight — dispatching again creates a second pending action. Guard with `if (status === 'loading') return` or disable the button when `status === 'loading'`.
- `rejectWithValue` vs thrown error — if you `throw` inside the payload creator, the error is serialized (only `message` and `name` survive). `rejectWithValue` passes your value directly.
- Stale data in `list` when the next fetch starts — decide whether to clear `list` on `pending` or keep the old data visible. Both are valid; pick one and justify it.
- Two thunks running for detail view while the first hasn't resolved — the last `fulfilled` action wins and overwrites `selected`.
