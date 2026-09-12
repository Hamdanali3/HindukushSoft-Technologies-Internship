# Day 35 — Frontend: Error Handling & Validation

## Task Overview
Handle frontend errors properly (error handling, validation).

## What was built
- `src/utils/parseApiError.js` — a single function that turns any Axios/Laravel error response (422, 401, 403, 404, 500, or a network failure) into a consistent `{ message, fieldErrors }` shape
- `src/components/ToastProvider.jsx` — a lightweight, dependency-free toast notification system (`useToast().showToast(...)`)
- `src/components/ErrorBoundary.jsx` — a class-based React error boundary that catches render-time crashes anywhere in the tree and shows a recoverable fallback UI instead of a blank white screen
- `TaskForm`, `TaskItem`, `Login`, `Register`, `useTasks` all updated to route their error handling through `parseApiError` + toasts, so field-level errors show inline while everything else (network issues, permission errors, server errors) surfaces as a toast

## Why two error channels (inline + toast)?
- **Inline field errors** answer "what do I need to fix?" — they belong next to the input that caused them (a 422 validation failure).
- **Toasts** answer "what just happened?" — for things the user can't fix by editing a field (network down, session expired, server error, a task someone else already deleted).

## How to run
```bash
npm install
npm run dev
```

## Try it
1. Turn off the Laravel backend and try loading `/dashboard` — the shared error message appears instead of a blank page.
2. Submit the task form with an empty title — an inline error appears under the field.
3. Throw an error inside a component's render on purpose — the `<ErrorBoundary>` catches it and shows a recovery screen instead of crashing the whole app.

See `Day35_Documentation.docx` in the parent folder for the full write-up.
