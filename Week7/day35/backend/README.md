# Day 35 — Backend: Error Handling & Validation

## Task Overview
Handle backend errors properly (error handling, validation).

## What was built
- `bootstrap_app_exceptions_excerpt.php` — Laravel 11/12 style centralised exception handling via `->withExceptions()`, mapping every exception type (`ValidationException`, `AuthenticationException`, `AuthorizationException`, `ModelNotFoundException`/`NotFoundHttpException`, and a generic `Throwable` fallback) to a clean JSON response with the correct HTTP status code.
- `app/Exceptions/Handler.php` — an equivalent implementation for teams on Laravel 10 or earlier (classic `Handler` class), included for completeness/reference.
- `app/Traits/ApiResponse.php` — `success()`/`error()` helpers so every controller returns the exact same JSON envelope shape.
- `TaskController` refactored to use the trait.
- Form Request validation (`StoreTaskRequest`/`UpdateTaskRequest`) already returns field-level errors in a predictable `errors: { field: [messages] }` shape (see Day 33).

## Response shape — always the same, success or failure
```json
// Success
{ "success": true, "message": "Task created successfully.", "data": { ... } }

// Validation error (422)
{ "success": false, "message": "The given data was invalid.", "errors": { "title": ["Please give the task a title."] } }

// Not found (404)
{ "success": false, "message": "The requested resource could not be found." }

// Unauthenticated (401)
{ "success": false, "message": "You must be logged in to perform this action." }

// Forbidden (403)
{ "success": false, "message": "You do not have permission to access this task." }
```

## Why this matters
Without centralised handling, an unhandled exception in Laravel returns
an HTML error page (or a raw stack trace in debug mode) — completely
unusable for a React SPA expecting JSON. Centralising this logic once,
instead of wrapping every controller method in try/catch, keeps
controllers clean and guarantees nothing slips through with an
inconsistent shape.

See `Day35_Documentation.docx` in the parent folder for the full write-up.
