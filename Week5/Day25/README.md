# TaskIndex

A frontend-only task manager built with React, styled after a library card catalog — drawers for views, index cards for tasks, and a due-date stamp for anything overdue.

Built for **Week 5 / Day 25** of the Full-Stack Web Development Internship — React Fundamentals.

## Live features

- Add, edit, delete, and complete tasks through a card-based interface
- Filter by view (All, Today, Upcoming, Completed) and by category (Work, Personal, Learning, Errands)
- Search across task titles and notes
- Sort by due date, priority, or recently added
- A progress ring and summary counters (open, due today, overdue, completed)
- Light and dark themes, remembered across visits
- Data persists in the browser via `localStorage` — no backend, no accounts, nothing to lose on refresh
- Fully responsive, from a 320px phone to a widescreen monitor
- Keyboard-accessible: visible focus states, `Escape` closes dialogs, all controls reachable by tab

## Tech stack

- **React 18** — function components and hooks only
- **Vite** — dev server and production bundler
- **Context + `useReducer`** for shared UI state (filters, search, sort, open dialogs)
- **A custom `useLocalStorage` hook** for persistence, kept separate from UI state so "what you're looking at" is never saved as if it were data
- Plain CSS with a token file (`src/styles/tokens.css`) — no CSS framework, so every color and spacing value is intentional and traceable

## Getting started

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

`npm run build` outputs a static bundle to `dist/` that can be deployed to any static host (Vercel, Netlify, GitHub Pages, S3, etc.) — there is no server-side code.

## Project structure

```
src/
├── components/       UI components (one file + one stylesheet each)
├── context/           TaskContext — the single source of truth for tasks and UI state
├── hooks/             useLocalStorage — generic persistence hook
├── utils/             taskUtils — filtering, sorting, date logic, seed data
├── styles/            tokens.css (design system) and global.css (resets/base)
├── App.jsx            Top-level layout
└── main.jsx           Entry point
```

## Design notes

The palette and type system live entirely in `src/styles/tokens.css` as CSS custom properties, so retheming is a matter of changing values in one place rather than hunting through components. The card-catalog concept (punch-hole card edges, drawer-style sidebar navigation, a rotated "past due" stamp) was chosen because a task list is, functionally, an index — the metaphor gives the UI a visual identity instead of defaulting to a generic to-do app look.
