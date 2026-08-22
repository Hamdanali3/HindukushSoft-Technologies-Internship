<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;

Route::get('/', [ProjectController::class, 'home'])->name('home');

Route::get('/about', [ProjectController::class, 'about'])
    ->name('about');

Route::get('/projects/{project}', [ProjectController::class, 'project'])
    ->name('project');