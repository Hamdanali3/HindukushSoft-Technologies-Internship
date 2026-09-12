<?php

use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Day 31
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider within a group
| which is assigned the "api" middleware group (throttling, JSON error
| formatting, etc. are already applied automatically by Laravel).
|
| Every route below is prefixed with /api automatically, so
| Route::get('/tasks', ...) is publicly reachable at:
|     GET http://your-app.test/api/tasks
|
*/

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'service' => 'TaskFlow API']);
});

Route::prefix('tasks')->controller(TaskController::class)->group(function () {
    Route::get('/', 'index');       // GET  /api/tasks
    Route::get('/{task}', 'show');  // GET  /api/tasks/{id}
});
