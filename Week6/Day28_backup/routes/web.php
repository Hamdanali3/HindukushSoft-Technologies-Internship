<?php
use App\Models\Task; use Illuminate\Support\Facades\Route;
Route::get('/',fn()=>view('dashboard',['total'=>Task::count(),'open'=>Task::whereIn('status',['todo','in_progress'])->count(),'done'=>Task::where('status','done')->count(),'tasks'=>Task::latest()->take(8)->get()]))->name('home');
