<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Task $task)
    {
        abort_unless($task->project->hasAccess($request->user()), 403);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $task->comments()->create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return redirect()
            ->route('tasks.show', $task)
            ->with('status', 'Comment posted.');
    }
}
