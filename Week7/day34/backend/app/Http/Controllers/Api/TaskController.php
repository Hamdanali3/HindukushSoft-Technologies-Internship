<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class TaskController (Day 34 version)
 *
 * Every route in this controller sits behind the `auth:sanctum`
 * middleware (see routes/api.php), so `$request->user()` is
 * guaranteed to be present. On top of that, every single query below
 * is additionally scoped with `->ownedBy($userId)` — this "belt and
 * braces" approach means that even if a route were accidentally left
 * unprotected, a user still could not read or modify another user's
 * tasks, because the query itself would simply return nothing.
 */
class TaskController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Task::query()->ownedBy($request->user()->id);

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

    public function store(StoreTaskRequest $request): JsonResponse
    {
        // user_id is deliberately NOT taken from the request body —
        // it is always derived from the authenticated user, which
        // prevents a malicious client from creating a task "as"
        // someone else by tampering with the payload.
        $task = Task::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully.',
            'data'    => new TaskResource($task),
        ], 201);
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        $this->authorizeOwnership($request, $task);

        return response()->json([
            'success' => true,
            'message' => 'Task retrieved successfully.',
            'data'    => new TaskResource($task),
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorizeOwnership($request, $task);

        $task->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully.',
            'data'    => new TaskResource($task->fresh()),
        ]);
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        $this->authorizeOwnership($request, $task);

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully.',
            'data'    => null,
        ]);
    }

    /**
     * Ensures the currently authenticated user actually owns the task
     * being accessed. Throwing an AuthorizationException here lets
     * Laravel's exception handler (customised in Day 35) turn this
     * into a clean, consistent 403 JSON response automatically.
     */
    private function authorizeOwnership(Request $request, Task $task): void
    {
        if ($task->user_id !== $request->user()->id) {
            throw new AuthorizationException('You do not have permission to access this task.');
        }
    }
}
