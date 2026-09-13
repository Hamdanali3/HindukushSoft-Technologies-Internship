# TaskFlow — Deployment Guide
**Internship Task — Week 8 / Day 39**

This guide covers taking TaskFlow from a local development environment to a
production-ready deployment, following the "role of environments" model:
**Development → Testing → Staging → Production**, each with its own purpose
and its own configuration.

## 1. Environments Overview

| Environment | Purpose | Database | Debug Mode |
|---|---|---|---|
| **Local (Development)** | Day-to-day coding | SQLite or local MySQL | `APP_DEBUG=true` |
| **Testing (CI)** | Automated test suite on every push | SQLite in-memory | `APP_DEBUG=true` |
| **Staging** | Final manual QA before release, mirrors production | MySQL (separate instance) | `APP_DEBUG=false` |
| **Production** | Live for real users | MySQL (managed/production instance) | `APP_DEBUG=false` |

Keeping these separate is the whole point of the exercise: a bug that only
shows up under production-like data volume or concurrency should be caught
in Staging, never discovered by a real user in Production. `APP_DEBUG` is
called out specifically because leaving it `true` in production is one of
the most common and most damaging Laravel misconfigurations — it exposes
stack traces, `.env` values, and query bindings directly in the browser.

## 2. Pre-Deployment Checklist

- [ ] `.env` copied from `.env.example` and every secret filled in (never
      commit `.env` — only `.env.example` belongs in version control)
- [ ] `APP_ENV=production` and `APP_DEBUG=false`
- [ ] `APP_KEY` generated fresh for this environment (`php artisan key:generate`)
- [ ] `SESSION_SECURE_COOKIE=true` (requires HTTPS)
- [ ] Database credentials point at the production database, **not** local
- [ ] All five bugs in `docs/BUGFIXES.md` verified fixed by the test suite
- [ ] `php artisan test` passes with zero failures
- [ ] `composer install --optimize-autoloader --no-dev` (no dev dependencies
      shipped to production)

## 3. Deployment Steps

```bash
# 1. Pull the latest code
git pull origin main

# 2. Install production dependencies only
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# 3. Copy and configure environment (first deploy only — afterwards
#    the server's own .env is preserved)
cp .env.example .env
php artisan key:generate

# 4. Run database migrations
php artisan migrate --force

# 5. Cache configuration, routes, and views for production performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Restart the queue worker (if using queued jobs)
php artisan queue:restart
```

## 4. Why `config:cache` etc. Matter

In development, Laravel re-reads `.env` and re-resolves the service
container on every request, which is convenient for iterating quickly.
`php artisan config:cache` collapses all configuration into a single
cached file so production requests skip that overhead entirely — this is a
deliberate development-vs-production trade-off, not an optional
micro-optimization; skipping it is a common cause of "slow in prod for no
reason" reports.

One gotcha this project's setup specifically avoids: `config:cache` freezes
whatever `.env` values were present *at cache time*. If `.env` changes
afterward, the cached config must be rebuilt (`php artisan config:cache`
again) or the app will keep serving stale configuration — this caught me
once locally while testing this exact deployment sequence, which is why
it's called out here rather than assumed to be obvious.

## 5. Continuous Integration

`.github/workflows/laravel.yml` runs on every push and pull request against
`main`/`develop`:

1. Installs PHP 8.3 and Composer dependencies
2. Copies `.env.example` → `.env` and generates a fresh app key
3. Runs migrations against an in-memory SQLite database (fast, isolated,
   no external DB needed for CI)
4. Runs the full PHPUnit suite (`php artisan test`) — the same tests in
   `tests/Feature/` documented in this folder
5. Runs Laravel Pint in `--test` mode to enforce consistent code style

A pull request cannot be merged if any of these steps fail, which is what
actually enforces the "tests must pass before deploy" rule rather than
relying on a developer remembering to run them locally.

## 6. Rollback Plan

If a deployment introduces a regression:

1. `php artisan down --render="errors::503"` — put the app into maintenance
   mode immediately, so users see a clean message instead of a broken app
2. `git checkout <last-known-good-tag>`
3. Re-run steps 2–5 of the deployment sequence above against the previous
   commit
4. `php artisan up` — bring the app back online
5. Investigate the failure in Staging before attempting the deploy again

---
*Reference: Medium — "Debug, Test, Deploy: The Role of Environments in
Software Development Cycle" — used to structure the environment separation
(Dev/Test/Staging/Prod) and the emphasis on catching issues progressively
earlier described in Section 1 and the checklist above.*
