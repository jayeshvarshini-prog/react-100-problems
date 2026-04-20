# 66 — Multi-Language Selector with Dynamic Translation Loading

## Problem Statement

You are building the internationalization (i18n) system for a SaaS platform. The app supports English, French, German, Spanish, and Japanese. Translation files are loaded lazily — only the active language's JSON file is fetched. Switching languages updates all translated strings in the UI without a page reload. The selected language is persisted to localStorage and to the user account.

---

## Expected Behavior

- On app load, the language is determined by: (1) localStorage, (2) browser `Accept-Language`, (3) default (English).
- The active translation file is fetched on mount and cached.
- `t('key')` function from a hook returns the translated string for the active language.
- Switching languages fetches the new language file if not cached, then updates all `t()` calls across the app.
- While a new language is loading, the app continues showing the current language (no flash of untranslated keys).
- Interpolation is supported: `t('greeting', { name: 'Alice' })` → "Hello, Alice".
- Pluralization is supported: `t('items_count', { count: 3 })` → "3 items".

---

## Required React Concepts

- `useContext` — provide the translation function and active language throughout the app
- `useState` — active language key, translations map, loading state
- `useEffect` — fetch translation file on language change
- `useRef` — module-level translation cache `{ [langCode]: translationsObject }`
- `useMemo` — derive the `t()` function from the loaded translations (stable reference unless translations change)
- `useCallback` — memoize `setLanguage` to avoid re-renders in consumers
- Custom hook (`useTranslation`) — expose `{ t, language, setLanguage, isLoading }`

---

## Constraints

- Translation files must be loaded lazily (not bundled with the app).
- The cache must be module-level so it persists across context re-mounts.
- `t()` must never throw — return the key string as fallback if a translation is missing.
- The `t()` function reference must be stable (not recreated on every render).

---

## Edge Cases to Consider

- Translation key not found in the active language — return the key itself as fallback.
- Translation file fails to load — keep the current language, show a toast warning.
- Interpolation key in the template (`{name}`) but not provided in the values object — render "[name]" or leave blank.
- Pluralization edge case: count = 1 (singular), count = 0 (check whether plural or a special zero form is needed).
- User switches language rapidly 5 times — only the last language switch's fetch should update the state.
- Japanese characters in translation values — must render correctly without encoding issues.
