<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class TaskController (Day 33 version)
 *
 * Extends the Day 31 read-only controller into a complete RESTful CRUD
 * resource that the React frontend can fully drive:
 *
 *   GET    /api/tasks        -> index    (list)
 *   POST   /api/tasks        -> store    (create)
 *   GET    /api/tasks/{id}   -> show     (read one)
 *   PUT    /api/tasks/{id}   -> update   (replace/edit)
 *   DELETE /api/tasks/{id}   -> destroy  (delete)
 *
 * Each mutating action returns the affected resource (or a clear
 * confirmation message) so the frontend never has to guess what
 * happened and can update its local state directly from the response.
 */
class TaskController extends Controller
{
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

        $tasks = $query->latest('created_at')->paginate($request->integer('per_page', 10));

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
        ]);
    }

    /**
     * POST /api/tasks
     * Validation is fully delegated to StoreTaskRequest — by the time
     * execution reaches this method, $request->validated() is
     * guaranteed to be clean data.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = Task::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully.',
            'data'    => new TaskResource($task),
        ], 201);
    }

    public function show(Task $task): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Task retrieved successfully.',
            'data'    => new TaskResource($task),
        ]);
    }

    /**
     * PUT/PATCH /api/tasks/{task}
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $task->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully.',
            'data'    => new TaskResource($task->fresh()),
        ]);
    }

    /**
     * DELETE /api/tasks/{task}
     */
    public function destroy(Task $task): JsonResponse
    {
        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully.',
            'data'    => null,
        ]);
    }
}
