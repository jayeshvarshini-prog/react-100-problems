# 77 — CSV Import Preview with Column Mapping

## Problem Statement

You are building a CSV import flow for a CRM SaaS. Users upload a CSV file and are shown a preview of the first 5 rows. They then map CSV columns to CRM fields using dropdowns. Required fields must be mapped. The import validates each row and shows per-row errors before the user confirms the import.

---

## Expected Behavior

- User uploads a CSV file. The browser parses it client-side using `FileReader`.
- The first row is treated as headers. A preview table shows headers and the first 5 data rows.
- A column mapping panel shows each CSV header with a dropdown to select the target CRM field.
- CRM fields include: First Name (required), Last Name (required), Email (required), Phone, Company, Notes.
- Clicking "Validate" runs client-side validation on all rows against the mapped fields.
- Validation errors are shown per row: "Row 4: Email is not a valid email address."
- If validation passes, a "Import N contacts" button becomes enabled.
- Confirming the import sends the full mapped data to the API.

---

## Required React Concepts

- `useState` — file content (parsed rows), column mapping object, validation errors, import loading state
- `useEffect` — parse the CSV file using FileReader on file selection
- `useMemo` — derive the preview rows from the full parsed data; derive whether all required fields are mapped; derive the mapped data payload from rows + column mapping; derive per-row validation errors
- `useCallback` — memoize mapping change handler, validate handler, import handler
- `useRef` — file input ref for programmatic trigger
- Custom hook (`useCSVImport`) — manage file parsing, column mapping, validation, and submission

---

## Constraints

- CSV parsing must be implemented manually (handle quoted fields with commas inside).
- No external CSV parsing libraries.
- Validation must run on all rows, not just the preview rows.
- The column mapping must support "Ignore" as an option (skip the column).

---

## Edge Cases to Consider

- CSV has duplicate column headers — must handle (suffix duplicates: "Name", "Name_2").
- CSV has 10,000 rows — parsing must not block the UI (use a Web Worker or process in chunks).
- An uploaded file is not valid CSV (e.g., a PDF) — show an error; do not attempt parsing.
- Email column mapped but contains a mix of valid and invalid emails — show per-row errors for invalid ones.
- Required field mapped to a CSV column that has empty values in some rows — per-row error for those rows.
- User re-uploads a new CSV after mapping — must reset the mapping.
