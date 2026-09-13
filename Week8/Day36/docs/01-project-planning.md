# TaskFlow — Capstone Project Plan
### Laravel Project & Task Management System
**Internship Task — Week 8 / Day 36**

---

## 1. Project Overview

**TaskFlow** is a multi-user project and task management platform built with
Laravel. It allows organisations to create projects, invite team members with
specific roles, break work down into tasks, track progress through a
Kanban-style workflow (`To Do → In Progress → In Review → Done`), and
collaborate through task comments.

This capstone was chosen deliberately for the internship because it exercises
every core skill expected of a Laravel full-stack developer in a single,
cohesive product:

- Relational database design (one-to-many, many-to-many, self-referencing
  ownership)
- Laravel Eloquent ORM & migrations
- Authentication & authorization (Sanctum + Policies)
- RESTful API design
- Blade UI + form validation
- Testing and deployment readiness

## 2. Problem Statement

Small teams frequently coordinate work across scattered tools — spreadsheets,
chat threads, sticky notes — which causes tasks to be duplicated, forgotten,
or left without a clear owner. TaskFlow solves this by giving every project a
single source of truth: one place to see what needs doing, who is doing it,
and how close it is to completion.

## 3. Objectives

| # | Objective | Success Criterion |
|---|-----------|--------------------|
| 1 | Allow authenticated users to create and manage projects | User can create, edit, archive, delete a project they own |
| 2 | Allow project owners to add team members with roles | Owner can invite a user as Manager or Member |
| 3 | Allow tasks to be created, assigned, and tracked | Task has status, priority, assignee, due date |
| 4 | Support discussion on tasks | Users can comment on a task they have access to |
| 5 | Expose the same functionality over a JSON API | Every web action has an equivalent authenticated API endpoint |
| 6 | Enforce access control | A user cannot view/edit a project or task they do not belong to |

## 4. Target Users & Roles

| Role | Description | Typical Permissions |
|------|-------------|----------------------|
| **Admin** | Platform-level administrator | Manage all projects and users |
| **Manager** | Owns / leads a project | Create tasks, assign members, edit project settings |
| **Member** | Contributor on a project | Update assigned tasks, comment |

## 5. Scope

### In Scope (this capstone)
- Project CRUD
- Team membership management (attach/detach users to a project with a role)
- Task CRUD with status/priority/assignee/due date
- Comments on tasks
- Authentication (registration, login, logout, password hashing)
- Authorization via Laravel Policies
- REST API mirroring the web functionality (Sanctum token auth)
- Automated feature tests
- Deployment configuration (`.env` management, environment guide)

### Out of Scope (future iterations)
- Real-time notifications (would use Laravel Echo/WebSockets)
- File attachments on tasks
- Time tracking / billing
- Third-party integrations (Slack, Google Calendar)

## 6. Development Methodology

The capstone follows an **incremental, milestone-based plan** that mirrors
how the wider internship is structured week over week:

| Day | Milestone | Deliverable |
|-----|-----------|-------------|
| **36** | Planning | Feature list, ERD, API route map |
| **37** | Core build | Models, migrations, controllers, Blade UI |
| **38** | Auth & CRUD completion | Authentication, policies, full CRUD, API resources |
| **39** | Hardening | Bug fixes, automated tests, deployment prep |

This mirrors a real sprint-based SDLC: **Plan → Build → Harden → Ship**, which
is intentional — it is the same rhythm used in professional Laravel teams
practising agile delivery.

## 7. Feature List (Detailed)

1. **Authentication**
   - Register, login, logout
   - Passwords hashed with bcrypt (Laravel default)
   - Email uniqueness validation

2. **Project Management**
   - Create / view / update / archive / delete a project
   - Only the owner or an Admin may edit/delete
   - Each project has a status: `planning`, `active`, `completed`, `archived`

3. **Team Membership**
   - Owner can add a registered user to the project with a role
   - Many-to-many relationship (`project_user` pivot table)

4. **Task Management**
   - Create / view / update / delete a task inside a project
   - Fields: title, description, status, priority, assignee, due date
   - Only project members can view/modify a project's tasks

5. **Comments**
   - Any project member can comment on a task
   - Comments are immutable once posted (editing is a stretch goal)

6. **API Layer**
   - Every feature above is available as a JSON:API-style REST endpoint
   - Token-based authentication (Laravel Sanctum)

## 8. Tools & Stack

| Layer | Technology |
|-------|------------|
| Backend framework | Laravel 12 (PHP 8.3) |
| Database | MySQL 8 (SQLite for local/testing) |
| Templating | Blade |
| Frontend styling | Tailwind CSS |
| Auth | Laravel Sanctum |
| Testing | PHPUnit / Laravel's testing helpers |
| Version control | Git |

## 9. References Used for Planning

- TechTarget, *"Project Planning"* — used to structure objectives, scope,
  and milestone breakdown above (Section 6-7 follow the plan → schedule →
  execute → review pattern described there).
- GeeksforGeeks, *"Database Design in DBMS"* — used to guide the
  normalization approach taken in `02-database-schema.md` (removing
  redundancy, defining primary/foreign keys, and building the ERD before
  writing a single migration).

---
*End of planning document — see `02-database-schema.md` and
`03-api-routes.md` for the technical design that follows directly from this
plan.*
