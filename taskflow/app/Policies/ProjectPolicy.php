<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    /**
     * Any authenticated user can see the *list* of their own projects —
     * filtering happens at the query level (Project::visibleTo), so this
     * policy only needs to answer "can $user see THIS project".
     */
    public function view(User $user, Project $project): bool
    {
        return $project->hasAccess($user);
    }

    public function create(User $user): bool
    {
        // Any authenticated user can start a new project and become its
        // owner — there's no gatekeeping on project creation itself.
        return true;
    }

    public function update(User $user, Project $project): bool
    {
        return $user->isAdmin() || $project->owner_id === $user->id;
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->isAdmin() || $project->owner_id === $user->id;
    }

    /**
     * Only the owner (or an admin) can change who's on the team.
     */
    public function manageMembers(User $user, Project $project): bool
    {
        return $user->isAdmin() || $project->owner_id === $user->id;
    }
}
