# Day 31 — TaskFlow REST API (Read Endpoints)

## Task Overview
Create API endpoints in Laravel to fetch data (REST APIs, JSON responses).

## What was built
A read-only REST API for a `Task` resource:

| Method | Endpoint            | Description                          |
|--------|---------------------|---------------------------------------|
| GET    | `/api/health`        | Simple health-check endpoint          |
| GET    | `/api/tasks`          | Paginated, filterable list of tasks   |
| GET    | `/api/tasks/{id}`     | A single task by ID                   |

## File map
```
backend/
├── app/Http/Controllers/Api/TaskController.php   # index() and show()
├── app/Http/Resources/TaskResource.php           # JSON response shaping
├── app/Models/Task.php                           # Eloquent model
├── database/migrations/..._create_tasks_table.php
├── database/factories/TaskFactory.php
├── database/seeders/TaskSeeder.php
└── routes/api.php
```

## How to run this locally (from a fresh Laravel 12 install)
```bash
composer create-project laravel/laravel taskflow-api
cd taskflow-api

# Copy the files from this folder into the matching paths of the new project
# (app/, database/, routes/) overwriting the defaults.

php artisan migrate
php artisan db:seed --class=TaskSeeder
php artisan serve
```

## Example requests
```bash
# List tasks
curl http://127.0.0.1:8000/api/tasks

# Filter by status + priority
curl "http://127.0.0.1:8000/api/tasks?status=pending&priority=high"

# Get one task
curl http://127.0.0.1:8000/api/tasks/1
```

## Example JSON response
```json
{
  "success": true,
  "message": "Tasks retrieved successfully.",
  "data": [
    {
      "id": 1,
      "title": "Prepare Week 7 internship submission",
      "description": "Finalise Day 31-35 deliverables and documentation.",
      "status": "in_progress",
      "priority": "high",
      "due_date": "2026-08-29",
      "is_overdue": false,
      "user_id": null,
      "created_at": "2026-08-27 10:12:00",
      "updated_at": "2026-08-27 10:12:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 10,
    "total": 27
  }
}
```

See `Day31_Documentation.docx` in the parent folder for the full write-up.
