# TaskFlow — API Route Plan
**Internship Task — Week 8 / Day 36**

All API routes are prefixed with `/api` and (except register/login) protected
by Laravel Sanctum token authentication (`auth:sanctum` middleware).
Authorization on top of authentication is enforced per-resource with Laravel
**Policies** (implemented Day 38).

## 1. Authentication

| Method | URI | Controller@Action | Auth Required | Description |
|---|---|---|---|---|
| POST | `/api/register` | `AuthController@register` | No | Create a new user account |
| POST | `/api/login` | `AuthController@login` | No | Exchange credentials for a Sanctum token |
| POST | `/api/logout` | `AuthController@logout` | Yes | Revoke the current token |
| GET | `/api/user` | `AuthController@me` | Yes | Return the authenticated user |

## 2. Projects

| Method | URI | Controller@Action | Auth | Description |
|---|---|---|---|---|
| GET | `/api/projects` | `Api\ProjectController@index` | Yes | List projects the user owns or belongs to |
| POST | `/api/projects` | `Api\ProjectController@store` | Yes | Create a project (creator becomes owner) |
| GET | `/api/projects/{project}` | `Api\ProjectController@show` | Yes | View a single project + its members |
| PUT/PATCH | `/api/projects/{project}` | `Api\ProjectController@update` | Yes (owner/admin) | Update project details |
| DELETE | `/api/projects/{project}` | `Api\ProjectController@destroy` | Yes (owner/admin) | Delete a project |

## 3. Project Membership

| Method | URI | Controller@Action | Auth | Description |
|---|---|---|---|---|
| POST | `/api/projects/{project}/members` | `Api\ProjectMemberController@store` | Yes (owner) | Add a user to a project |
| DELETE | `/api/projects/{project}/members/{user}` | `Api\ProjectMemberController@destroy` | Yes (owner) | Remove a member |

## 4. Tasks (nested under project)

| Method | URI | Controller@Action | Auth | Description |
|---|---|---|---|---|
| GET | `/api/projects/{project}/tasks` | `Api\TaskController@index` | Yes (member) | List a project's tasks (filterable by status/priority) |
| POST | `/api/projects/{project}/tasks` | `Api\TaskController@store` | Yes (member) | Create a task |
| GET | `/api/tasks/{task}` | `Api\TaskController@show` | Yes (member) | View a task |
| PUT/PATCH | `/api/tasks/{task}` | `Api\TaskController@update` | Yes (member) | Update a task (status, assignee, etc.) |
| DELETE | `/api/tasks/{task}` | `Api\TaskController@destroy` | Yes (manager/owner) | Delete a task |

## 5. Comments (nested under task)

| Method | URI | Controller@Action | Auth | Description |
|---|---|---|---|---|
| GET | `/api/tasks/{task}/comments` | `Api\CommentController@index` | Yes (member) | List comments on a task |
| POST | `/api/tasks/{task}/comments` | `Api\CommentController@store` | Yes (member) | Add a comment |
| DELETE | `/api/comments/{comment}` | `Api\CommentController@destroy` | Yes (author/admin) | Delete own comment |

## 6. Dashboard / Reporting

| Method | URI | Controller@Action | Auth | Description |
|---|---|---|---|---|
| GET | `/api/dashboard/stats` | `Api\DashboardController@stats` | Yes | Task counts by status/priority across the user's projects |

## 7. Design Conventions

- Routes follow **RESTful resource conventions** (`apiResource`) wherever
  possible, keeping the API predictable and self-documenting.
- Nested resources (`projects/{project}/tasks`) are used only for the
  **index/store** actions, where the parent context matters; **show/update/
  destroy** use the flat `tasks/{task}` form, which is the pattern Laravel's
  own documentation recommends for *shallow nesting* — it keeps URLs short
  while still scoping creation to the right parent.
- All responses are JSON, wrapped using Laravel **API Resources**
  (`ProjectResource`, `TaskResource`, `CommentResource`) so the frontend
  receives a stable, versioned shape regardless of internal DB column names.
- Validation happens in dedicated **Form Request** classes
  (`StoreTaskRequest`, `UpdateProjectRequest`, …), not inline in controllers.

The web (Blade) routes mirror this same resource set for the server-rendered
UI and are documented alongside the controllers in the Day 37 deliverable.

---
*This route map is implemented incrementally: the web equivalents are built
Day 37, the API layer + auth + policies are completed Day 38.*
