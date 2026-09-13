<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * List tasks for a project, filterable by status/priority via
     * query params — e.g. GET /api/projects/3/tasks?status=in_progress
     */
    public function index(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $tasks = $project->tasks()
            ->with('assignee')
            ->withCount('comments')
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->when($request->filled('priority'), fn ($q) => $q->where('priority', $request->priority))
            ->latest()
            ->get();

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request, Project $project)
    {
        $task = $project->tasks()->create($request->validated());

        return new TaskResource($task->load('assignee'));
    }

    public function show(Task $task)
    {
        $this->authorize('view', $task);

        return new TaskResource($task->load('assignee')->loadCount('comments'));
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update($request->validated());

        return new TaskResource($task->fresh('assignee'));
    }

    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json(null, 204);
    }
}
