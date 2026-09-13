<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;

class CommentPolicy
{
    public function create(User $user, Comment $comment): bool
    {
        return $comment->task->project->hasAccess($user);
    }

    /**
     * A user may only remove their own comment (or an admin can moderate
     * anyone's) — comments are otherwise treated as an immutable record of
     * the discussion.
     */
    public function delete(User $user, Comment $comment): bool
    {
        return $user->isAdmin() || $comment->user_id === $user->id;
    }
}
