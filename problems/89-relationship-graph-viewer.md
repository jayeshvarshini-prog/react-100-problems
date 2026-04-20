# 89 — Relationship Graph Viewer

## Problem Statement

You are building a relationship graph viewer for a CRM SaaS that visualizes connections between contacts, companies, and deals. Nodes represent entities; edges represent relationships (e.g., "Works at", "Owns", "Involved in"). The graph is rendered on an HTML5 canvas using a force-directed layout. Users can click a node to select it (showing its details in a sidebar), drag nodes, and zoom/pan the canvas.

---

## Expected Behavior

- On mount, graph data (nodes and edges) is fetched from the API.
- A force-directed layout algorithm positions nodes (basic spring-physics simulation).
- Nodes are color-coded by type (contact = blue, company = green, deal = purple).
- Edges are drawn as lines with arrowheads and relationship labels.
- Clicking a node selects it (highlighted ring) and opens its detail panel on the right.
- Dragging a node moves it; the layout adjusts accordingly.
- Mouse wheel or pinch gesture zooms the canvas in/out. Clicking-and-dragging the canvas background pans it.
- A "Reset Layout" button re-runs the force layout.

---

## Required React Concepts

- `useState` — selected node ID, zoom level, pan offset, simulation running flag
- `useEffect` — fetch graph data on mount; run the force simulation in a `requestAnimationFrame` loop; re-draw canvas on every simulation tick
- `useRef` — canvas element ref; nodes array (mutable during simulation); edges array; drag state; animation frame ID
- `useMemo` — derive selected node details from the node ID and node list
- `useCallback` — memoize mousedown, mousemove, mouseup, wheel handlers
- Custom hook (`useForceLayout`) — manage the simulation state, tick function, and reset

---

## Constraints

- The force-directed layout must be implemented manually (basic Coulomb repulsion + Hooke attraction).
- The simulation must run in `requestAnimationFrame` and stop when velocities are below a threshold.
- Node positions must be stored in `useRef` (mutable during simulation) — not in state.
- Canvas re-draw must happen in `requestAnimationFrame`, not via React re-renders.

---

## Edge Cases to Consider

- Graph has 0 nodes — render empty canvas with "No data" overlay.
- Graph has 1 node — no edges; place the node at center; simulation immediately stabilizes.
- Very dense graph (200+ nodes) — simulation must cap iterations to avoid freezing the browser.
- Dragging a node during simulation — must "pin" the node (stop its simulation velocity) while dragging.
- Node details sidebar opens but the node is then deleted from the graph — sidebar must clear.
- Canvas resize — must re-scale to the new container size without losing node positions.
