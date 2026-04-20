# 84 — Geographic Filter UI (Region/Country/City Selector)

## Problem Statement

You are building a geographic filter panel for a SaaS analytics dashboard. Users can filter data by geographic region at three levels: Region (e.g., North America), Country (filtered by selected region), and City (filtered by selected country). Selecting a higher-level filter resets lower-level selections. The available options at each level are loaded from the API. All three levels support multi-select.

---

## Expected Behavior

- On mount, the available regions are fetched.
- Selecting one or more regions triggers a fetch of countries for those regions.
- Selecting one or more countries triggers a fetch of cities for those countries.
- Clearing a region deselects all its countries and cities.
- All three selectors support multi-select (checkboxes).
- A "Selected filters" summary shows: "North America, Europe → 5 countries → 12 cities."
- An "Apply" button sends the final selection to the parent as a filter payload.
- A "Clear All" button resets all three levels.

---

## Required React Concepts

- `useReducer` — filter state: `{ regions: [], countries: [], cities: [] }` with SELECT_REGIONS, SELECT_COUNTRIES, SELECT_CITIES, CLEAR actions
- `useEffect` — fetch countries when selected regions change; fetch cities when selected countries change; cancel in-flight fetches when selections change
- `useRef` — AbortController for each level's fetch
- `useMemo` — derive the "Selected filters" summary string; derive the apply payload
- `useCallback` — memoize each level's change handler
- Custom hook (`useGeoFilter`) — manage cascade logic, dependent fetching, and state for all three levels

---

## Constraints

- Selecting a region must automatically clear all country and city selections (cascade reset).
- Fetches for countries and cities must be cancelled (AbortController) when the upstream selection changes.
- Multi-select state for each level must use a Set or array of IDs.
- No external geolocation or select libraries.

---

## Edge Cases to Consider

- User selects Region A (triggering a country fetch), then immediately selects Region B — the first fetch must be cancelled; only regions A+B's countries should load.
- All regions deselected — country and city selectors must clear and disable.
- A selected country belongs to a region that was later deselected — that country must be automatically deselected.
- City list for a country is very large (1000+ cities) — must use a searchable dropdown with virtualization.
- Apply clicked with only regions selected (no countries/cities) — payload should reflect region-level filter only.
- "Clear All" while a fetch is in-flight — must cancel the fetch and reset state.
