<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'status',
        'start_date',
        'end_date',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Team members on this project (does NOT automatically include the
     * owner unless the owner has also been added as a member row — the
     * owner always has full access via the `owner_id` check regardless).
     */
    public function members()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * True if the given user is the owner OR a member of this project.
     * Central place used by both controllers and policies so "who can see
     * this project" is defined exactly once.
     */
    public function hasAccess(User $user): bool
    {
        if ($user->isAdmin() || $this->owner_id === $user->id) {
            return true;
        }

        return $this->members()->where('user_id', $user->id)->exists();
    }

    public function scopeVisibleTo($query, User $user)
    {
        return $query->where('owner_id', $user->id)
            ->orWhereHas('members', fn ($q) => $q->where('user_id', $user->id));
    }
}
