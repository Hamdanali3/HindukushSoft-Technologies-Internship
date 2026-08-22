<?php

use App\Http\Controllers\WorkItemController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('work-items.index');
});

Route::resource('work-items', WorkItemController::class);