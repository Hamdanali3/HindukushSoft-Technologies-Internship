<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

class ProjectMemberController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $this->authorize('manageMembers', $project);

        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'role' => ['sometimes', 'in:manager,member'],
        ]);

        $project->members()->syncWithoutDetaching([
            $validated['user_id'] => ['role' => $validated['role'] ?? 'member'],
        ]);

        return UserResource::collection($project->members()->get());
    }

    public function destroy(Request $request, Project $project, User $user)
    {
        $this->authorize('manageMembers', $project);

        abort_if($user->id === $project->owner_id, 422, 'The project owner cannot be removed.');

        $project->members()->detach($user->id);

        return response()->json(null, 204);
    }
}
