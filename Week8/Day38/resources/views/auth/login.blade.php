@extends('layouts.app')
@section('content')

    <div class="max-w-sm mx-auto mt-12">
        <h1 class="text-2xl font-bold mb-6 text-center">Log in to TaskFlow</h1>

        <form method="POST" action="{{ route('login') }}" class="space-y-4">
            @csrf

            <div>
                <label class="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" value="{{ old('email') }}" required autofocus
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Password</label>
                <input type="password" name="password" required
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
            </div>

            @error('email')
                <p class="text-red-600 text-xs">{{ $message }}</p>
            @enderror

            <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" name="remember"> Remember me
            </label>

            <button type="submit"
                    class="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                Log in
            </button>
        </form>

        <p class="text-sm text-gray-500 text-center mt-4">
            No account? <a href="{{ route('register') }}" class="text-indigo-600 hover:underline">Register</a>
        </p>
    </div>

@endsection
