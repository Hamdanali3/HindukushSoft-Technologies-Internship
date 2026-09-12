<?php

/**
 * bootstrap/app.php (relevant excerpt) — Laravel 11 / 12 style
 *
 * Since Laravel 11, exception handling configuration moved out of a
 * dedicated app/Exceptions/Handler.php class and into the
 * `->withExceptions()` closure inside bootstrap/app.php. This file
 * shows exactly what was added to make the TaskFlow API return
 * clean, consistent JSON for every kind of failure instead of
 * Laravel's default HTML error pages.
 *
 * A traditional Handler.php equivalent (for teams still on Laravel 10
 * or earlier) is provided alongside this file as
 * app/Exceptions/Handler.php for reference.
 */

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {

        // 404 — a model wasn't found, or the route itself doesn't exist.
        // Both are normalised into one predictable "Resource not found."
        // JSON shape so the frontend never has to special-case each.
        $exceptions->render(function (ModelNotFoundException|NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'The requested resource could not be found.',
                ], 404);
            }
        });

        // 401 — no valid Sanctum token was supplied.
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'You must be logged in to perform this action.',
                ], 401);
            }
        });

        // 403 — logged in, but not allowed to touch this resource
        // (e.g. someone else's task — see TaskController::authorizeOwnership()).
        $exceptions->render(function (AuthorizationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage() ?: 'You do not have permission to perform this action.',
                ], 403);
            }
        });

        // 422 — validation failures. Form Requests already format
        // this nicely (see StoreTaskRequest::failedValidation), but
        // this catch-all covers any inline $request->validate() calls
        // too, e.g. inside AuthController::login().
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'The given data was invalid.',
                    'errors'  => $e->errors(),
                ], 422);
            }
        });

        // 500 — anything unexpected. In production we deliberately hide
        // the raw exception message/trace from the client (a stack
        // trace is an information-disclosure risk); locally, showing
        // it saves a huge amount of debugging time.
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*') && ! app()->bound('debug_render_skip')) {
                $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;

                return response()->json([
                    'success' => false,
                    'message' => config('app.debug')
                        ? $e->getMessage()
                        : 'Something went wrong on our end. Please try again shortly.',
                    'exception' => config('app.debug') ? get_class($e) : null,
                ], $status ?: 500);
            }
        });
    })->create();
