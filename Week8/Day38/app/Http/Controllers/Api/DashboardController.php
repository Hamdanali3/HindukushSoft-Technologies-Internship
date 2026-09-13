<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Aggregate counts by status/priority across every project the
     * authenticated user has access to — powers a stats widget on
     * whatever frontend eventually consumes this API.
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        $tasks = Task::whereHas('project', fn ($q) => $q->visibleTo($user))->get();

        return response()->json([
            'total_tasks' => $tasks->count(),
            'by_status' => $tasks->groupBy('status')->map->count(),
            'by_priority' => $tasks->groupBy('priority')->map->count(),
            'overdue' => $tasks->filter->isOverdue()->count(),
            'assigned_to_me' => $tasks->where('assigned_to', $user->id)->count(),
        ]);
    }
}
