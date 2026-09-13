@extends('layouts.app')
@section('content')

    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold">{{ $project->name }}</h1>
            <p class="text-sm text-gray-500 mt-1">{{ $project->description }}</p>
        </div>
        @if ($project->owner_id === auth()->id())
            <a href="{{ route('projects.edit', $project) }}" class="text-sm text-indigo-600 hover:underline">
                Edit project
            </a>
        @endif
    </div>

    {{-- Kanban board: one column per status --}}
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        @foreach (\App\Models\Task::STATUSES as $status)
            <div class="bg-gray-100 rounded-lg p-3">
                <h3 class="text-xs font-semibold uppercase text-gray-500 mb-3">
                    {{ str_replace('_', ' ', $status) }}
                    <span class="text-gray-400">({{ $tasksByStatus->get($status, collect())->count() }})</span>
                </h3>

                <div class="space-y-2">
                    @foreach ($tasksByStatus->get($status, collect()) as $task)
                        <a href="{{ route('tasks.show', $task) }}"
                           class="block bg-white rounded-md p-3 border border-gray-200 shadow-sm hover:shadow">
                            <p class="text-sm font-medium">{{ $task->title }}</p>
                            <div class="flex items-center justify-between mt-2">
                                <span class="text-xs px-2 py-0.5 rounded-full
                                    @class([
                                        'bg-red-50 text-red-600' => $task->priority === 'high',
                                        'bg-yellow-50 text-yellow-700' => $task->priority === 'medium',
                                        'bg-gray-100 text-gray-600' => $task->priority === 'low',
                                    ])">
                                    {{ $task->priority }}
                                </span>
                                <span class="text-xs text-gray-400">
                                    {{ $task->assignee->name ?? 'Unassigned' }}
                                </span>
                            </div>
                        </a>
                    @endforeach
                </div>
            </div>
        @endforeach
    </div>

    <div class="mt-8 border-t pt-6">
        <h2 class="font-semibold mb-3">Add a task</h2>
        <form method="POST" action="{{ route('projects.tasks.store', $project) }}" class="flex gap-3">
            @csrf
            <input type="text" name="title" placeholder="Task title" required
                   class="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm">
            <select name="status" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                @foreach (\App\Models\Task::STATUSES as $status)
                    <option value="{{ $status }}">{{ str_replace('_', ' ', $status) }}</option>
                @endforeach
            </select>
            <select name="priority" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                @foreach (\App\Models\Task::PRIORITIES as $priority)
                    <option value="{{ $priority }}" @selected($priority === 'medium')>{{ $priority }}</option>
                @endforeach
            </select>
            <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                Add
            </button>
        </form>
    </div>

@endsection
