# Day 34 — Backend: Authentication & Protected Routes

## Task Overview
Protect routes and show user-specific data (authentication flow — backend half).

## What was built
- Laravel Sanctum token authentication (`User` model + `HasApiTokens`)
- `AuthController`: `register`, `login`, `logout`, `me`
- `tasks` table now has a proper foreign key to `users` (`user_id` NOT NULL, `cascadeOnDelete`)
- `TaskController` now:
  - sits entirely behind the `auth:sanctum` middleware
  - scopes every query with `->ownedBy($request->user()->id)`
  - double-checks ownership on `show`/`update`/`destroy` and throws a 403 if violated

## Endpoints
| Method | Endpoint       | Auth required | Purpose                    |
|--------|----------------|:--------------:|-----------------------------|
| POST   | /api/register  | No              | Create an account, get a token |
| POST   | /api/login     | No              | Exchange credentials for a token |
| GET    | /api/me        | Yes             | Get the current user          |
| POST   | /api/logout    | Yes             | Revoke the current token       |
| GET/POST/PUT/DELETE | /api/tasks[/{id}] | Yes | User-scoped task CRUD |

## Example flow
```bash
# 1. Register
curl -X POST http://127.0.0.1:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ayesha Khan","email":"ayesha@example.com","password":"secret123","password_confirmation":"secret123"}'

# Response includes a "token" — use it below.

# 2. Fetch my tasks (protected)
curl http://127.0.0.1:8000/api/tasks \
  -H "Authorization: Bearer <TOKEN_FROM_STEP_1>"
```

## Setup notes
```bash
composer require laravel/sanctum
php artisan install:api   # publishes Sanctum config + migration
php artisan migrate
```

See `Day34_Documentation.docx` in the parent folder for the full write-up.
