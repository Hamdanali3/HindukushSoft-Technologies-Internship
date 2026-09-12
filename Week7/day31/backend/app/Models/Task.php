<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Task
 *
 * Represents a single task/to-do item belonging (eventually) to a user.
 * This model is intentionally kept "thin" — business rules live in the
 * controllers / form requests, while the model focuses on data shape,
 * relationships and small convenience helpers.
 *
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property string $status
 * @property string $priority
 * @property string|null $due_date
 * @property int|null $user_id
 */
class Task extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * Explicitly whitelisting fields protects the API from
     * "mass assignment" vulnerabilities.
     */
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'user_id',
    ];

    /**
     * Attribute casting — ensures the API always receives the correct
     * data types (e.g. a proper date instance instead of a raw string).
     */
    protected $casts = [
        'due_date'   => 'date:Y-m-d',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The valid values a task's status may hold.
     * Centralising this here means both the model and validation rules
     * (see Day 35) can reference a single source of truth.
     */
    public const STATUSES = ['pending', 'in_progress', 'completed'];

    /**
     * The valid values a task's priority may hold.
     */
    public const PRIORITIES = ['low', 'medium', 'high'];

    /**
     * A task belongs to the user who created it.
     * This relationship becomes active once authentication is wired up
     * in Day 34, but is defined here so the model is ready in advance.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Local query scope: only tasks matching a given status.
     * Usage: Task::status('completed')->get();
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Local query scope: only tasks matching a given priority.
     */
    public function scopePriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Convenience accessor to know if a task is overdue.
     * Exposed to the frontend via TaskResource::is_overdue.
     */
    public function getIsOverdueAttribute(): bool
    {
        return $this->due_date
            && $this->status !== 'completed'
            && $this->due_date->isPast();
    }
}
