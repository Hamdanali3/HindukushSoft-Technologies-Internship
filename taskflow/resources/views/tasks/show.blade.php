@extends('layouts.app')
@section('content')

    <a href="{{ route('projects.show', $task->project) }}" class="text-sm text-indigo-600 hover:underline">
        &larr; Back to {{ $task->project->name }}
    </a>

    <h1 class="text-2xl font-bold mt-3">{{ $task->title }}</h1>
    <p class="text-gray-600 mt-2">{{ $task->description }}</p>

    <dl class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-sm">
        <div><dt class="text-gray-400">Status</dt><dd class="capitalize">{{ str_replace('_',' ',$task->status) }}</dd></div>
        <div><dt class="text-gray-400">Priority</dt><dd class="capitalize">{{ $task->priority }}</dd></div>
        <div><dt class="text-gray-400">Assignee</dt><dd>{{ $task->assignee->name ?? 'Unassigned' }}</dd></div>
        <div><dt class="text-gray-400">Due</dt><dd>{{ $task->due_date?->format('M j, Y') ?? '—' }}</dd></div>
    </dl>

    <section class="mt-10">
        <h2 class="font-semibold mb-3">Comments</h2>

        <div class="space-y-3">
            @forelse ($task->comments as $comment)
                <div class="bg-white border border-gray-200 rounded-md p-3">
                    <p class="text-sm">{{ $comment->body }}</p>
                    <p class="text-xs text-gray-400 mt-1">
                        {{ $comment->user->name }} · {{ $comment->created_at->diffForHumans() }}
                    </p>
                </div>
            @empty
                <p class="text-sm text-gray-400">No comments yet.</p>
            @endforelse
        </div>

        <form method="POST" action="{{ route('tasks.comments.store', $task) }}" class="mt-4 flex gap-3">
            @csrf
            <input type="text" name="body" placeholder="Add a comment..." required
                   class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm">
            <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                Post
            </button>
        </form>
    </section>

@endsection
