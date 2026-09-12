<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

/**
 * Class TaskController (Day 35 version)
 *
 * Functionally identical to Day 34's controller, but every response is
 * now produced through the ApiResponse trait's success()/error()
 * helpers instead of building `response()->json([...])` by hand in
 * every method. This is the final polish pass: consistent responses,
 * consistent errors, nothing left to chance.
 */
class TaskController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
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

        return $this->success(
            'Tasks retrieved successfully.',
            TaskResource::collection($tasks->items()),
            200,
            [
                'current_page' => $tasks->currentPage(),
                'last_page'    => $tasks->lastPage(),
                'per_page'     => $tasks->perPage(),
                'total'        => $tasks->total(),
            ]
        );
    }

    public function store(StoreTaskRequest $request)
    {
        $task = Task::create([...$request->validated(), 'user_id' => $request->user()->id]);

        return $this->success('Task created successfully.', new TaskResource($task), 201);
    }

    public function show(Request $request, Task $task)
    {
        $this->authorizeOwnership($request, $task);

        return $this->success('Task retrieved successfully.', new TaskResource($task));
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->authorizeOwnership($request, $task);

        $task->update($request->validated());

        return $this->success('Task updated successfully.', new TaskResource($task->fresh()));
    }

    public function destroy(Request $request, Task $task)
    {
        $this->authorizeOwnership($request, $task);

        $task->delete();

        return $this->success('Task deleted successfully.');
    }

    private function authorizeOwnership(Request $request, Task $task): void
    {
        if ($task->user_id !== $request->user()->id) {
            // Caught centrally by the exception handler (see
            // bootstrap_app_exceptions_excerpt.php) and turned into a
            // clean 403 JSON response automatically.
            throw new AuthorizationException('You do not have permission to access this task.');
        }
    }
}
