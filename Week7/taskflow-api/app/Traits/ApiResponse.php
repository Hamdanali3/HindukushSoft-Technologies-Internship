<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

/**
 * Trait ApiResponse
 *
 * Small helper used by controllers to guarantee every SUCCESS response
 * follows the exact same envelope as every ERROR response produced by
 * the exception handler ({ success, message, data|errors }). Having
 * one shape for the whole API — success or failure — means the React
 * frontend can write one small, shared response-parsing helper
 * instead of special-casing every endpoint.
 */
trait ApiResponse
{
    protected function success(string $message, mixed $data = null, int $status = 200, array $meta = []): JsonResponse
    {
        $payload = [
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ];

        if (! empty($meta)) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $status);
    }

    protected function error(string $message, int $status = 400, ?array $errors = null): JsonResponse
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }
}
