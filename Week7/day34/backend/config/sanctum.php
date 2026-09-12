<?php

/**
 * config/sanctum.php (relevant excerpt)
 *
 * This project uses Sanctum purely for API TOKEN authentication
 * (i.e. the SPA sends `Authorization: Bearer <token>`), so the
 * "stateful" cookie-based mode is not required. The default config
 * published by `php artisan install:api` already supports this out
 * of the box; the notes below are the only settings worth double
 * -checking for a token-based setup like this one.
 */
return [

    // Not used in this project since we authenticate with bearer
    // tokens rather than first-party cookies, but left at Sanctum's
    // default in case a cookie-based admin panel is added later.
    'stateful' => explode(',', env(
        'SANCTUM_STATEFUL_DOMAINS',
        'localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:8000'
    )),

    'guard' => ['web'],

    // Tokens never expire by default; set a value here (in minutes)
    // if you want issued tokens to auto-expire, e.g. 60 * 24 for 1 day.
    'expiration' => null,

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies'      => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token'  => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],
];
