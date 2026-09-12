# Day 33 — Backend: Full CRUD API

## Task Overview
Connect React frontend with Laravel backend for Create, Read, Update, Delete operations.

## What was added on top of Day 31
- `Route::apiResource('tasks', TaskController::class)` — all 5 RESTful actions
- `store()`, `update()`, `destroy()` methods on `TaskController`
- `StoreTaskRequest` / `UpdateTaskRequest` — dedicated Form Request validation classes
- Consistent JSON envelope (`success`, `message`, `data`) on every response, including 201 (Created) and 422 (Validation error)

## Endpoints
| Method | Endpoint            | Purpose         |
|--------|----------------------|-----------------|
| GET    | /api/tasks            | List tasks      |
| POST   | /api/tasks            | Create a task   |
| GET    | /api/tasks/{id}       | Read one task   |
| PUT    | /api/tasks/{id}       | Update a task   |
| DELETE | /api/tasks/{id}       | Delete a task   |

## Example — create a task
```bash
curl -X POST http://127.0.0.1:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write internship report","priority":"high","due_date":"2026-09-01"}'
```

See `Day33_Documentation.docx` in the parent folder for the full write-up.
