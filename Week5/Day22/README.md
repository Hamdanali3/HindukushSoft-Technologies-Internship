# Northlight — Team

A small team directory built to demonstrate reusable components and props:
one `Header`, one `UserCard`, rendered six times from a single array of
plain data.

## Running it locally

```bash
npm install
npm run dev
```

## What's in here

- `src/App.jsx` — owns the team data and renders one `<UserCard />` per
  entry.
- `src/data/team.js` — the team roster as plain JavaScript objects.
- `src/components/Header.jsx` — reusable page header (title, subtitle,
  and a count, all passed in as props).
- `src/components/UserCard.jsx` — reusable profile card.
- `src/components/Tag.jsx` — reusable skill pill.
- `src/components/StatusDot.jsx` — reusable status indicator.

## Build

```bash
npm run build
```
