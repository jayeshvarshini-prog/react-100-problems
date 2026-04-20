import { useState } from 'react';
import LiveSearchAndDebounce from './live_search_and_debounce.jsx';

// Register your solutions here: { id, label, Component }
const PROBLEMS = [
  {
    id: 1,
    label: '01 — Live Search & Debounce',
    Component: LiveSearchAndDebounce,
  },
  // Add new problems below as you create them, e.g.:
  // { id: 2, label: '02 — Infinite Scroll Feed', Component: InfiniteScrollFeed },
];

export default function App() {
  const [activeId, setActiveId] = useState(PROBLEMS[0].id);
  const active = PROBLEMS.find((p) => p.id === activeId);

  return (
    <div className="playground">
      <aside className="sidebar">
        <h2>Problems</h2>
        {PROBLEMS.map((p) => (
          <button
            key={p.id}
            className={p.id === activeId ? 'active' : ''}
            onClick={() => setActiveId(p.id)}
          >
            {p.label}
          </button>
        ))}
      </aside>

      <main className="main">
        <h1>{active.label}</h1>
        <div className="component-frame">
          <active.Component />
        </div>
      </main>
    </div>
  );
}
