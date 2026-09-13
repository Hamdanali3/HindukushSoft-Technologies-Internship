@extends('layouts.app')
@section('content')

    <div class="max-w-sm mx-auto mt-12">
        <h1 class="text-2xl font-bold mb-6 text-center">Create your account</h1>

        <form method="POST" action="{{ route('register') }}" class="space-y-4">
            @csrf

            <div>
                <label class="block text-sm font-medium mb-1">Name</label>
                <input type="text" name="name" value="{{ old('name') }}" required autofocus
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                @error('name') <p class="text-red-600 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" value="{{ old('email') }}" required
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                @error('email') <p class="text-red-600 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Password</label>
                <input type="password" name="password" required
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Confirm password</label>
                <input type="password" name="password_confirmation" required
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
            </div>

            <button type="submit"
                    class="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                Create account
            </button>
        </form>

        <p class="text-sm text-gray-500 text-center mt-4">
            Already registered? <a href="{{ route('login') }}" class="text-indigo-600 hover:underline">Log in</a>
        </p>
    </div>

@endsection
