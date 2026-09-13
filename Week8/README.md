# Week 8 — Capstone Project (TaskFlow)

**Internship:** Software Engineering — Laravel Track
**Intern:** Hamdan Ali, BS Software Engineering, Air University, Islamabad

This week's four tasks build one continuous capstone project — **TaskFlow**,
a Laravel project & task management system — rather than four disconnected
exercises. Each day's folder is self-contained (code + a Word write-up) but
builds directly on the day before it:

| Day | Folder | Focus | Documentation |
|-----|--------|-------|----------------|
| 36 | `Day36/` | Planning: features, database schema, API routes | `Day36_Documentation.docx` |
| 37 | `Day37/` | Frontend UI (Blade) & backend logic (models, web controllers) | `Day37_Documentation.docx` |
| 38 | `Day38/` | Authentication, authorization, full CRUD, and the JSON API | `Day38_Documentation.docx` |
| 39 | `Day39/` | Automated testing, bug fixes, and deployment preparation | `Day39_Documentation.docx` |

## How to read this folder

Each `DayXX/` folder contains:
- The actual Laravel-style source files produced that day (models,
  controllers, migrations, routes, views, tests, config — whatever that
  day's task called for)
- A `DayXX_Documentation.docx` explaining, in my own words, what was built,
  the reasoning behind the key decisions, and what I'd point to first if
  asked to walk someone through it

Start with `Day36/docs/01-project-planning.md` for the project brief, then
follow the days in order — the database schema from Day 36 is what Day 37's
models are built on, Day 37's controllers are what Day 38 adds
authentication and an API on top of, and Day 39's tests are written
directly against the Day 37/38 behaviour.

## Stack

Laravel 12 · PHP 8.3 · MySQL 8 (SQLite for testing) · Blade + Tailwind CSS ·
Laravel Sanctum · PHPUnit · GitHub Actions
