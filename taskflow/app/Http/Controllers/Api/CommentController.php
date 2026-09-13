<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Task;

class CommentController extends Controller
{
    public function index(Task $task)
    {
        $this->authorize('view', $task);

        return CommentResource::collection(
            $task->comments()->with('user')->get()
        );
    }

    public function store(StoreCommentRequest $request, Task $task)
    {
        $comment = $task->comments()->create([
            'body' => $request->validated('body'),
            'user_id' => $request->user()->id,
        ]);

        return new CommentResource($comment->load('user'));
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json(null, 204);
    }
}
