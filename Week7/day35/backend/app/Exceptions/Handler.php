<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

/**
 * Class Handler (Laravel 10 and earlier style)
 *
 * Provided as a reference alongside the Laravel 11/12 bootstrap/app.php
 * approach used elsewhere in this project, since many teams and
 * tutorials still teach/maintain the classic Handler class.
 * Functionally, the two files below implement the exact same
 * behaviour: every API error response is a predictable JSON object of
 * the shape { success, message, errors? }.
 */
class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->renderable(function (Throwable $e, Request $request) {
            if (! $request->is('api/*') && ! $request->wantsJson()) {
                return null; // fall back to Laravel's default HTML handling
            }

            return $this->toApiResponse($e);
        });
    }

    /**
     * Central translator: turns any exception into a clean, consistent
     * JSON error envelope with the correct HTTP status code.
     */
    private function toApiResponse(Throwable $e): JsonResponse
    {
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

        $payload = ['success' => false, 'message' => $message];
        if ($errors) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status ?: 500);
    }
}
