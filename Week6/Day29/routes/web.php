<?php
use App\Http\Controllers\TaskController; use Illuminate\Support\Facades\Route;
Route::get('/',fn()=>to_route('tasks.index')); Route::resource('tasks',TaskController::class);
