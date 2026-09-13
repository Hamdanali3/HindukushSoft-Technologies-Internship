@extends('layouts.app')
@section('content')

    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Your Projects</h1>
        <a href="{{ route('projects.create') }}"
           class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
            + New Project
        </a>
    </div>

    @if ($projects->isEmpty())
        <div class="text-center text-gray-500 py-16 border border-dashed rounded-lg">
            No projects yet — create your first one to get started.
        </div>
    @else
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @foreach ($projects as $project)
                <a href="{{ route('projects.show', $project) }}"
                   class="block bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="font-semibold text-lg">{{ $project->name }}</h2>
                        <span class="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 capitalize">
                            {{ $project->status }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 line-clamp-2">{{ $project->description }}</p>
                    <p class="text-xs text-gray-400 mt-3">{{ $project->tasks_count }} tasks</p>
                </a>
            @endforeach
        </div>

        <div class="mt-6">{{ $projects->links() }}</div>
    @endif

@endsection
