# 128 — Cascading Dropdowns (Dependent Async Selects)

## Problem Statement

Build a three-level location selector: Country → State → City. Selecting a country fetches its states. Selecting a state fetches its cities. Each dropdown is disabled until its parent has a value. Changing a parent resets all children and re-fetches. Handle loading and error states per dropdown independently.

---

## Expected Behavior

- On mount, countries are fetched and the Country dropdown is populated.
- State and City dropdowns are disabled with placeholder "Select country first" / "Select state first".
- Selecting a country: State dropdown enters loading state, fetches states for that country, then becomes enabled. City is still disabled.
- Selecting a state: City dropdown enters loading state, fetches cities, then becomes enabled.
- Changing the country: State and City both reset to empty/disabled, a new state fetch fires.
- If any fetch fails, that dropdown shows "Failed to load — retry?" with a retry button.

---

## Required Concepts

- `useEffect` with dependency on selected parent value
- Resetting child state when parent changes (inside the parent's `useEffect`)
- Independent loading/error/data state per dropdown level
- `async/await` with `try/catch` per fetch
- `useState` — selectedCountry, selectedState, selectedCity, plus states/cities arrays and their loading/error flags

---

## Constraints

- Do not fetch states or cities until the user has made a selection — no pre-fetching all combinations.
- Changing the country must immediately disable and clear the State and City dropdowns before the new fetch resolves.
- Do not reuse a single loading state for all three dropdowns.

---

## Edge Cases to Consider

- User selects a country, then immediately changes it before states finish loading — the first state fetch response must be discarded.
- What if a country has zero states — show "No states available" in the dropdown.
- What if the city fetch fails — can the user still select a state and retry?
