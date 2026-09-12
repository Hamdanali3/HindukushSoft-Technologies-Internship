# Day 34 — Frontend: Authentication Flow & Protected Routes

## Task Overview
Protect routes and show user-specific data (authentication flow — frontend half).

## What was built
- `src/context/AuthContext.jsx` — global auth state (`user`, `login`, `register`, `logout`), rehydrated on page refresh via `GET /api/me`
- `src/routes/ProtectedRoute.jsx` — React Router guard that redirects unauthenticated users to `/login`
- `src/components/Login.jsx`, `Register.jsx` — auth forms with inline error handling
- `src/components/Dashboard.jsx` — the protected page showing only the logged-in user's tasks
- `src/services/api.js` — Axios instance with a request interceptor that attaches `Authorization: Bearer <token>` automatically, and a response interceptor that logs the user out on a 401

## How to run
```bash
npm install
npm run dev
```

## Try it
1. Go to `/register`, create an account.
2. You're redirected straight to `/dashboard` — try creating a task.
3. Log out, then try visiting `/dashboard` directly — you're bounced to `/login`.
4. Log back in — you're returned to `/dashboard` automatically.

See `Day34_Documentation.docx` in the parent folder for the full write-up.
