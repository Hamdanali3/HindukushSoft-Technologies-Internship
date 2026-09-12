<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Class User
 *
 * The `HasApiTokens` trait (from laravel/sanctum) is the piece that
 * turns a normal Eloquent user into one that can issue and be
 * authenticated by API tokens — this is what powers the entire
 * Day 34 authentication flow.
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    /**
     * A user owns many tasks — this is the inverse of Task::user().
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
