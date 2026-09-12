<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\Request;
use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null; // let web routes behave normally
            }

            [$status, $message, $errors] = match (true) {
                $e instanceof ValidationException => [
                    422, 'The given data was invalid.', $e->errors(),
                ],
                $e instanceof AuthenticationException => [
                    401, 'You must be logged in to perform this action.', null,
                ],
                $e instanceof AuthorizationException => [
                    403, $e->getMessage() ?: 'You do not have permission to perform this action.', null,
                ],
                $e instanceof ModelNotFoundException, $e instanceof NotFoundHttpException => [
                    404, 'The requested resource could not be found.', null,
                ],
                default => [
                    method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500,
                    config('app.debug') ? $e->getMessage() : 'Something went wrong on our end. Please try again shortly.',
                    null,
                ],
            };

            return response()->json(array_filter([
                'success' => false,
                'message' => $message,
                'errors'  => $errors,
            ], fn ($v) => $v !== null), $status);
        });
    })->create();