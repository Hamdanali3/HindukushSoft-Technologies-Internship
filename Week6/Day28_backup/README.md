# Day 28 — Workboard Data Foundation

Laravel 12 MySQL migration and Eloquent foundation.

## Setup
`composer install`
`cp .env.example .env`
`php artisan key:generate`
Configure MySQL in `.env`.
`php artisan migrate --seed`
`php artisan serve`

The migration adds task fields, defaults and indexes. The model defines fillable attributes and date casting. The factory/seeder creates realistic demonstration data.
