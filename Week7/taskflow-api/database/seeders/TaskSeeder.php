<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        // Create (or reuse) a demo user to own the seeded tasks.
        $user = User::firstOrCreate(
            ['email' => 'demo@example.com'],
            ['name' => 'Demo User', 'password' => Hash::make('password123')]
        );

        Task::factory()->count(25)->create(['user_id' => $user->id]);

        Task::factory()->create([
            'title'       => 'Prepare Week 7 internship submission',
            'description' => 'Finalise Day 31-35 deliverables and documentation.',
            'status'      => 'in_progress',
            'priority'    => 'high',
            'due_date'    => now()->addDays(2)->format('Y-m-d'),
            'user_id'     => $user->id,
        ]);

        Task::factory()->create([
            'title'       => 'Review pull request from teammate',
            'description' => 'Check code style and run the test suite before approving.',
            'status'      => 'pending',
            'priority'    => 'medium',
            'due_date'    => now()->addDays(5)->format('Y-m-d'),
            'user_id'     => $user->id,
        ]);
    }
}