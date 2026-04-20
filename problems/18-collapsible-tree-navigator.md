# 18 — Collapsible Tree Navigator

## Problem Statement

You are building the file/folder tree navigator for a document management system. The tree renders a nested hierarchy of folders and files fetched from an API. Folders can be expanded and collapsed. Expanding a folder that hasn't been loaded yet triggers a lazy fetch of its children. The currently selected item is highlighted. The tree supports keyboard navigation.

---

## Expected Behavior

- The root level of the tree is loaded on mount.
- Each folder node shows a toggle arrow. Clicking it expands or collapses the folder.
- Expanding a folder that has no loaded children fetches them from the API and renders them when ready.
- A spinner appears on the folder node while its children are loading.
- Clicking any node (file or folder) selects it, highlighting it and calling an `onSelect` prop.
- Keyboard: Arrow Right expands a folder or moves to first child; Arrow Left collapses a folder or moves to parent; Arrow Up/Down navigates among visible nodes.
- The selected node scrolls into view if it is outside the visible area.

---

## Required React Concepts

- `useReducer` — manage tree state: `{ nodes: { [id]: { ...node, children, isOpen, isLoading } } }`
- `useEffect` — fetch root nodes on mount
- `useCallback` — memoize toggle, select, and keyboard handlers
- `useRef` — reference to the selected node element for scroll-into-view; ref to the tree container for keyboard event delegation
- `useMemo` — derive the flat list of currently visible nodes (for keyboard navigation index)
- Recursive component pattern — a `TreeNode` component renders itself recursively for children

---

## Constraints

- Tree must be lazy-loaded: children are fetched only when a folder is first expanded.
- Once children are loaded, expanding/collapsing a folder must not re-fetch.
- The tree must support at least 5 levels of nesting.
- No external tree component libraries.

---

## Edge Cases to Consider

- Folder has 0 children (empty folder) — show a "No files" message when expanded, not a spinner.
- Two folders expanded simultaneously trigger two fetches — both must complete independently.
- Selected node is inside a collapsed parent — expanding the parent must reveal and scroll to the node.
- Node IDs are not sequential integers — use string IDs safely.
- Very deep nesting — indentation must not overflow the container.
- Network error during child fetch — show error on the folder node with a retry option.
