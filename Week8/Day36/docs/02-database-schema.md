# TaskFlow — Database Design
**Internship Task — Week 8 / Day 36**

## 1. Design Approach

The schema was designed following the standard DBMS design pipeline:

1. **Requirements analysis** — derived from the feature list in
   `01-project-planning.md`.
2. **Conceptual design (ER Model)** — identify entities, attributes, and
   relationships.
3. **Logical design** — convert the ER model into relational tables,
   normalise to **3NF** to remove redundancy (e.g. task status/priority are
   stored as constrained strings/enums on the table itself rather than in
   free text, and membership roles live in the pivot table rather than being
   duplicated per task).
4. **Physical design** — map to Laravel migrations with correct column
   types, indexes, and foreign key constraints.

## 2. Entity-Relationship Diagram (textual)

```
 ┌───────────────┐        owns (1:N)        ┌───────────────┐
 │     users     │ ───────────────────────► │    projects   │
 │───────────────│                          │───────────────│
 │ id PK         │                          │ id PK         │
 │ name          │                          │ name          │
 │ email UNIQUE  │                          │ description   │
 │ password      │                          │ owner_id FK   │──► users.id
 │ role          │                          │ status        │
 │ created_at    │                          │ start_date    │
 └───────┬───────┘                          │ end_date      │
         │                                  └───────┬───────┘
         │ M:N (via project_user)                    │ 1:N
         ▼                                            ▼
 ┌────────────────────┐                      ┌───────────────┐
 │   project_user      │                      │     tasks     │
 │──────────────────── │                      │───────────────│
 │ id PK               │                      │ id PK         │
 │ project_id FK        │──► projects.id       │ project_id FK │──► projects.id
 │ user_id FK            │──► users.id          │ assigned_to FK│──► users.id (nullable)
 │ role                 │                      │ title         │
 │ created_at            │                      │ description   │
 └──────────────────────┘                      │ status        │
                                                 │ priority      │
                                                 │ due_date      │
                                                 └───────┬───────┘
                                                          │ 1:N
                                                          ▼
                                                 ┌───────────────┐
                                                 │   comments    │
                                                 │───────────────│
                                                 │ id PK         │
                                                 │ task_id FK    │──► tasks.id
                                                 │ user_id FK    │──► users.id
                                                 │ body          │
                                                 │ created_at    │
                                                 └───────────────┘
```

## 3. Table Specifications

### 3.1 `users`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK, auto-increment |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL (bcrypt hash) |
| role | ENUM('admin','manager','member') | DEFAULT 'member' |
| email_verified_at | TIMESTAMP | NULLABLE |
| remember_token | VARCHAR(100) | NULLABLE |
| created_at / updated_at | TIMESTAMP | |

### 3.2 `projects`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | NULLABLE |
| owner_id | BIGINT UNSIGNED | FK → users.id, CASCADE on delete |
| status | ENUM('planning','active','completed','archived') | DEFAULT 'planning' |
| start_date | DATE | NULLABLE |
| end_date | DATE | NULLABLE |
| created_at / updated_at | TIMESTAMP | |

### 3.3 `project_user` (pivot — many-to-many team membership)
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| project_id | BIGINT UNSIGNED | FK → projects.id, CASCADE |
| user_id | BIGINT UNSIGNED | FK → users.id, CASCADE |
| role | ENUM('manager','member') | DEFAULT 'member' |
| created_at / updated_at | TIMESTAMP | |
| — | UNIQUE(project_id, user_id) | prevents duplicate membership |

### 3.4 `tasks`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| project_id | BIGINT UNSIGNED | FK → projects.id, CASCADE |
| assigned_to | BIGINT UNSIGNED | FK → users.id, NULLABLE, SET NULL on delete |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NULLABLE |
| status | ENUM('todo','in_progress','in_review','done') | DEFAULT 'todo' |
| priority | ENUM('low','medium','high') | DEFAULT 'medium' |
| due_date | DATE | NULLABLE |
| created_at / updated_at | TIMESTAMP | |
| — | INDEX(project_id, status) | speeds up board queries |

### 3.5 `comments`
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| task_id | BIGINT UNSIGNED | FK → tasks.id, CASCADE |
| user_id | BIGINT UNSIGNED | FK → users.id, CASCADE |
| body | TEXT | NOT NULL |
| created_at / updated_at | TIMESTAMP | |

## 4. Normalisation Notes

- **1NF**: every column holds a single atomic value (e.g. no comma-separated
  assignee lists — that is exactly why `project_user` exists as its own
  table instead of a `member_ids` column on `projects`).
- **2NF**: all non-key attributes depend on the *whole* primary key — trivial
  here since every table uses a single surrogate `id` key.
- **3NF**: no transitive dependencies — e.g. `tasks.status` does not depend
  on `tasks.project_id`, so it correctly lives on the `tasks` row itself,
  not duplicated on `projects`.

## 5. Relationships Summary (Eloquent)

| Model | Relationship |
|---|---|
| `User` | `hasMany(Project::class, 'owner_id')` — projects owned |
| `User` | `belongsToMany(Project::class)->withPivot('role')` — projects joined |
| `User` | `hasMany(Task::class, 'assigned_to')` — assigned tasks |
| `Project` | `belongsTo(User::class, 'owner_id')` |
| `Project` | `belongsToMany(User::class)->withPivot('role')` |
| `Project` | `hasMany(Task::class)` |
| `Task` | `belongsTo(Project::class)` |
| `Task` | `belongsTo(User::class, 'assigned_to')` |
| `Task` | `hasMany(Comment::class)` |
| `Comment` | `belongsTo(Task::class)` |
| `Comment` | `belongsTo(User::class)` |

See `database/migrations/` in this folder for the physical implementation
of every table above, written exactly as they will be used from Day 37
onward.

---
*Reference: GeeksforGeeks, "Database Design in DBMS" — the normalisation
steps (1NF → 2NF → 3NF) applied above follow the general design procedure
described in that article.*
