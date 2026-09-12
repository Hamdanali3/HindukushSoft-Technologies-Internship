<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

/**
 * Class AuthController
 *
 * Implements a stateless, token-based authentication flow using
 * Laravel Sanctum. This is the standard, officially-recommended
 * approach for a decoupled SPA (React) talking to a Laravel API,
 * and is considerably simpler to operate than a full OAuth/Passport
 * setup for a project of this size.
 *
 * Flow:
 *   1. POST /api/register -> creates the user, returns a token
 *   2. POST /api/login    -> verifies credentials, returns a token
 *   3. Frontend stores the token and sends it as
 *      `Authorization: Bearer <token>` on every subsequent request
 *   4. POST /api/logout   -> revokes the token that was used to call it
 */
class AuthController extends Controller
{
    /**
     * POST /api/register
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please check the errors below.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Naming the token after the client helps when auditing/revoking
        // tokens later (e.g. "logout of all devices").
        $token = $user->createToken('taskflow-web')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Account created successfully.',
            'data'    => [
                'user'  => $user->only('id', 'name', 'email'),
                'token' => $token,
            ],
        ], 201);
    }

    /**
     * POST /api/login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            // Intentionally vague — never reveal whether the email or the
            // password was the incorrect part; this prevents user
            // enumeration attacks.
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('taskflow-web')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully.',
            'data'    => [
                'user'  => $user->only('id', 'name', 'email'),
                'token' => $token,
            ],
        ]);
    }

    /**
     * GET /api/me
     * Lets the frontend verify a stored token is still valid and
     * re-hydrate the logged-in user on page refresh.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Authenticated user retrieved.',
            'data'    => $request->user()->only('id', 'name', 'email'),
        ]);
    }

    /**
     * POST /api/logout
     * Revokes only the token used to authenticate the current request,
     * so a user can be logged out of one device without affecting
     * their sessions elsewhere.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }
}
