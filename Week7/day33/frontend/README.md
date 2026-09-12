# Day 33 — Frontend: Full-Stack CRUD

## Task Overview
Connect the React frontend with the Laravel backend for Create, Read, Update, Delete operations.

## What was added on top of Day 32
- `src/services/api.js` — `createTask`, `updateTask`, `deleteTask` methods
- `src/hooks/useTasks.js` — mutation helpers (`createTask`, `editTask`, `removeTask`) that keep local state in sync with the server
- `src/components/TaskForm.jsx` — a single reusable form for both create and edit, with inline validation-error display
- `src/components/TaskItem.jsx` — Edit / Delete buttons with a confirmation prompt before deleting

## How to run
```bash
npm install
npm run dev
```

See `Day33_Documentation.docx` in the parent folder for the full write-up.
