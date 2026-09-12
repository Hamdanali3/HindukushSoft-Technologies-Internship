<?php

use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Day 34 (Authentication + Protected Routes)
|--------------------------------------------------------------------------
|
| Two clear zones:
|
|   1. Public routes  — anyone can call these without a token.
|   2. Protected zone — wrapped in the `auth:sanctum` middleware group.
|      Any request without a valid `Authorization: Bearer <token>`
|      header is automatically rejected with a 401 Unauthenticated
|      JSON response before it ever reaches the controller.
|
*/

// ---- Public routes ----
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ---- Protected routes ----
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Every task route below is both authenticated (must be logged in)
    // and, inside the controller, scoped to the current user (can only
    // ever see/modify their own tasks).
    Route::apiResource('tasks', TaskController::class);
});
