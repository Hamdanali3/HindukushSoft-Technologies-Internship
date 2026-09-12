<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class TaskController (Day 31 version)
 *
 * Day 31's goal is deliberately scoped: expose the "Task" resource
 * through clean, RESTful, read-only JSON endpoints.
 *
 *   GET /api/tasks       -> paginated list of tasks (with optional filters)
 *   GET /api/tasks/{id}  -> a single task
 *
 * Create / Update / Delete are added in Day 33 once the React frontend
 * is ready to consume them, and authentication/error-handling polish
 * is layered on in Day 34 and Day 35 respectively.
 */
class TaskController extends Controller
{
    /**
     * GET /api/tasks
     *
     * Returns a paginated, filterable list of tasks.
     * Supports optional query parameters:
     *   ?status=pending|in_progress|completed
     *   ?priority=low|medium|high
     *   ?search=keyword   (matches against the title)
     *   ?per_page=15      (defaults to 10)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Task::query();

        if ($request->filled('status')) {
            $query->status($request->string('status'));
        }

        if ($request->filled('priority')) {
            $query->priority($request->string('priority'));
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->string('search') . '%');
        }

        $tasks = $query
            ->latest('created_at')
            ->paginate($request->integer('per_page', 10));

        return response()->json([
            'success' => true,
            'message' => 'Tasks retrieved successfully.',
            'data'    => TaskResource::collection($tasks->items()),
            'meta'    => [
                'current_page' => $tasks->currentPage(),
                'last_page'    => $tasks->lastPage(),
                'per_page'     => $tasks->perPage(),
                'total'        => $tasks->total(),
            ],
        ], 200);
    }

    /**
     * GET /api/tasks/{task}
     *
     * Returns a single task. Laravel's Route-Model Binding automatically
     * resolves the {task} URI segment into a Task model instance (or a
     * 404 response if no matching record exists), which is why the
     * controller method body itself stays short and declarative.
     */
    
    public function show(Task $task): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Task retrieved successfully.',
            'data'    => new TaskResource($task),
        ], 200);
    }
}
