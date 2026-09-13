@extends('layouts.app')
@section('content')

    <h1 class="text-2xl font-bold mb-6">New Project</h1>

    <form method="POST" action="{{ route('projects.store') }}" class="max-w-xl space-y-4">
        @csrf

        <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input type="text" name="name" value="{{ old('name') }}"
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
            @error('name') <p class="text-red-600 text-xs mt-1">{{ $message }}</p> @enderror
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" rows="4"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">{{ old('description') }}</textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium mb-1">Status</label>
                <select name="status" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    @foreach (['planning', 'active', 'completed', 'archived'] as $status)
                        <option value="{{ $status }}">{{ ucfirst($status) }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Start date</label>
                <input type="date" name="start_date" class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
            </div>
        </div>

        <button type="submit"
                class="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
            Create Project
        </button>
    </form>

@endsection
