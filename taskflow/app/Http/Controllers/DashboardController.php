<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Personal landing page: "what's on my plate across every project".
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $myTasks = Task::with('project')
            ->where('assigned_to', $user->id)
            ->whereIn('status', ['todo', 'in_progress', 'in_review'])
            ->orderBy('due_date')
            ->get();

        $stats = [
            'projects' => $user->projects()->count() + $user->ownedProjects()->count(),
            'open_tasks' => $myTasks->count(),
            'overdue' => $myTasks->filter->isOverdue()->count(),
        ];

        return view('dashboard', compact('myTasks', 'stats'));
    }
}
