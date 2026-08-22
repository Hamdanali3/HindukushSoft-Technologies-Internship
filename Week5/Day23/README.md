# TallyLab — Precision Tally Counter (Day 23)

A small React application built around two ideas from the `useState` hook and
the event system that sits on top of it: a mechanical-style tally counter,
and a "Day Lab / Night Lab" instrument theme switch.

The whole interface is styled as a physical instrument panel rather than a
generic dashboard — brass and sage accents, a sunken digit-wheel readout,
and a rocker light switch — to give an otherwise simple counter exercise a
concrete identity instead of a template look.

## Features

- **Digit-reel counter** — a four-wheel mechanical readout (`0000`–`9999`)
  that flips each digit into place on change, clamped to a defined range
  with a shake + warning message when a limit is hit.
- **Adjustable step size** — move the tally by ×1, ×5 or ×10 per press.
- **Keyboard shortcuts** — `↑` to increment, `↓` to decrement, `R` to reset.
- **Session stats** — live counts of increments, decrements, resets and the
  session's peak value.
- **Persistent state** — the tally value and chosen theme survive a page
  reload via `localStorage`.
- **Day Lab / Night Lab theme switch** — a rocker-style toggle that swaps
  the whole panel's palette, including a phosphor-style glow on the digits
  at night, with `prefers-color-scheme` used as the first-visit default.
- Fully keyboard-accessible controls, visible focus states, and
  `prefers-reduced-motion` support.

## Tech stack

- React 18 (function components, `useState`, `useEffect`)
- Vite 5 for tooling and bundling
- Plain CSS with custom properties for theming (no UI framework)

## Getting started

```bash
npm install
npm run dev       # start the local dev server
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Project structure

```
Day23/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx / App.css
│   ├── index.css              # design tokens for both themes
│   └── components/
│       ├── Counter.jsx / Counter.css
│       └── ThemeToggle.jsx / ThemeToggle.css
└── TallyLab_Day23_Documentation.docx
```

## Reference material

- W3Schools — [React useState](https://www.w3schools.com/react/react_usestate.asp)
- W3Schools — [React Events](https://www.w3schools.com/react/react_events.asp)
