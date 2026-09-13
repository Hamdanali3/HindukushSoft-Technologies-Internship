@extends('layouts.app')
@section('content')

    <h1 class="text-2xl font-bold mb-6">My Dashboard</h1>

    <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold">{{ $stats['projects'] }}</p>
            <p class="text-xs text-gray-500">Projects</p>
        </div>
        <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold">{{ $stats['open_tasks'] }}</p>
            <p class="text-xs text-gray-500">Open tasks assigned to me</p>
        </div>
        <div class="bg-white rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold text-red-600">{{ $stats['overdue'] }}</p>
            <p class="text-xs text-gray-500">Overdue</p>
        </div>
    </div>

    <h2 class="font-semibold mb-3">My open tasks</h2>
    <div class="space-y-2">
        @forelse ($myTasks as $task)
            <a href="{{ route('tasks.show', $task) }}"
               class="flex items-center justify-between bg-white border rounded-md p-3 hover:shadow-sm">
                <div>
                    <p class="text-sm font-medium">{{ $task->title }}</p>
                    <p class="text-xs text-gray-400">{{ $task->project->name }}</p>
                </div>
                <span class="text-xs {{ $task->isOverdue() ? 'text-red-600' : 'text-gray-400' }}">
                    {{ $task->due_date?->format('M j') ?? 'No due date' }}
                </span>
            </a>
        @empty
            <p class="text-sm text-gray-400">Nothing on your plate right now.</p>
        @endforelse
    </div>

@endsection
