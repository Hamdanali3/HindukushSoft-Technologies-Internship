<?php

use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Day 33 (Full CRUD)
|--------------------------------------------------------------------------
|
| apiResource() automatically wires up all 5 RESTful actions
| (index, store, show, update, destroy) to conventional URIs/verbs,
| and — because it's the "api" variant — it deliberately skips the
| create/edit routes that only make sense for server-rendered HTML
| forms, since React owns the UI here.
|
*/

Route::apiResource('tasks', TaskController::class);

/*
Equivalent to:
GET    /api/tasks           tasks.index
POST   /api/tasks           tasks.store
GET    /api/tasks/{task}    tasks.show
PUT    /api/tasks/{task}    tasks.update
DELETE /api/tasks/{task}    tasks.destroy
*/
