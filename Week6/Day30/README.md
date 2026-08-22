# Day 30 — Workboard Access

Laravel 12 authentication fundamentals implemented explicitly for learning clarity.

## Setup
`composer install`
`cp .env.example .env`
`php artisan key:generate`
Configure MySQL in `.env`.
`php artisan migrate`
`php artisan serve`

## Security focus
CSRF tokens, validation, unique email enforcement, password hashing through `Hash`, authentication middleware, session regeneration after login/registration, and session invalidation on logout.
