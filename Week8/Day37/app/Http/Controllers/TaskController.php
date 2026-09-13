<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Request $request, Project $project)
    {
        abort_unless($project->hasAccess($request->user()), 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:todo,in_progress,in_review,done'],
            'priority' => ['required', 'in:low,medium,high'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'due_date' => ['nullable', 'date'],
        ]);

        $task = $project->tasks()->create($validated);

        return redirect()
            ->route('projects.show', $project)
            ->with('status', "Task \"{$task->title}\" added.");
    }

    public function show(Request $request, Task $task)
    {
        abort_unless($task->project->hasAccess($request->user()), 403);

        $task->load(['assignee', 'comments.user']);

        return view('tasks.show', compact('task'));
    }

    public function edit(Request $request, Task $task)
    {
        abort_unless($task->project->hasAccess($request->user()), 403);

        return view('tasks.edit', compact('task'));
    }

    /**
     * Handles both full edits and quick inline status changes coming
     * from the Kanban board's drag-and-drop status update.
     */
    public function update(Request $request, Task $task)
    {
        abort_unless($task->project->hasAccess($request->user()), 403);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'required', 'in:todo,in_progress,in_review,done'],
            'priority' => ['sometimes', 'required', 'in:low,medium,high'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'due_date' => ['nullable', 'date'],
        ]);

        $task->update($validated);

        if ($request->wantsJson()) {
            return response()->json($task->fresh());
        }

        return redirect()
            ->route('projects.show', $task->project)
            ->with('status', 'Task updated.');
    }

    public function destroy(Request $request, Task $task)
    {
        $project = $task->project;

        abort_unless(
            $project->owner_id === $request->user()->id
                || $project->members()->wherePivot('user_id', $request->user()->id)->wherePivot('role', 'manager')->exists(),
            403
        );

        $task->delete();

        return redirect()
            ->route('projects.show', $project)
            ->with('status', 'Task deleted.');
    }
}
