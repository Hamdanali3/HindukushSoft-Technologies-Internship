# Day 32 — Fetch Laravel API Data into React

## Task Overview
Fetch data from the Laravel API (built in Day 31) and display it in React.

## What was built
- `src/services/api.js` — Axios instance + `taskService` API wrapper
- `src/hooks/useTasks.js` — custom hook managing fetch/loading/error/pagination state
- `src/components/TaskList.jsx` — renders the list, loading spinner, error + empty states
- `src/components/TaskItem.jsx` — a single task card
- `src/components/TaskFilters.jsx` — status/priority/search filters wired to the API
- `src/App.jsx`, `src/main.jsx` — app shell

## Environment
Create a `.env` file next to `package.json`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## How to run
```bash
npm install
npm run dev
```
Make sure the Day 31 Laravel API is running on `php artisan serve` (default
`http://127.0.0.1:8000`) and that CORS is enabled for the Vite dev server
origin (`http://localhost:5173`) in `config/cors.php`.

See `Day32_Documentation.docx` in the parent folder for the full write-up.
