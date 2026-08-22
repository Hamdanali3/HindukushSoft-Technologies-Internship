<?php
use App\Http\Controllers\ProjectController; use Illuminate\Support\Facades\Route;
Route::get('/',[ProjectController::class,'home'])->name('home');
Route::prefix('projects')->name('projects.')->group(fn()=>Route::get('/{project}',[ProjectController::class,'show'])->name('show'));
Route::get('/about',[ProjectController::class,'about'])->name('about');
