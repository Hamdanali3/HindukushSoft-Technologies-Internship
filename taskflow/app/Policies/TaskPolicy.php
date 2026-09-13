<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function view(User $user, Task $task): bool
    {
        return $task->project->hasAccess($user);
    }

    /**
     * Any project member can create/update a task — this is a
     * collaborative tool, not a strictly hierarchical one, so members are
     * trusted with day-to-day task management.
     */
    public function create(User $user, Task $task): bool
    {
        return $task->project->hasAccess($user);
    }

    public function update(User $user, Task $task): bool
    {
        return $task->project->hasAccess($user);
    }

    /**
     * Deleting a task is more destructive than editing it, so it's
     * restricted to the project owner or a manager-level member.
     */
    public function delete(User $user, Task $task): bool
    {
        $project = $task->project;

        if ($user->isAdmin() || $project->owner_id === $user->id) {
            return true;
        }

        return $project->members()
            ->wherePivot('user_id', $user->id)
            ->wherePivot('role', 'manager')
            ->exists();
    }
}
