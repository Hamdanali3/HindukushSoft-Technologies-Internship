<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;

/**
 * TaskSeeder
 *
 * Populates the tasks table with 25 sample records so the API has
 * meaningful data to return the moment the project is cloned — useful
 * both for manual testing (Postman) and for the React app in Day 32.
 *
 * Run with: php artisan db:seed --class=TaskSeeder
 */
class TaskSeeder extends Seeder
{
    public function run(): void
    {
        Task::factory()->count(25)->create();

        // A couple of deliberately crafted, realistic examples on top
        // of the random data, useful for demoing filters in Postman.
        Task::factory()->create([
            'title'       => 'Prepare Week 7 internship submission',
            'description' => 'Finalise Day 31-35 deliverables and documentation.',
            'status'      => 'in_progress',
            'priority'    => 'high',
            'due_date'    => now()->addDays(2)->format('Y-m-d'),
        ]);

        Task::factory()->create([
            'title'       => 'Review pull request from teammate',
            'description' => 'Check code style and run the test suite before approving.',
            'status'      => 'pending',
            'priority'    => 'medium',
            'due_date'    => now()->addDays(5)->format('Y-m-d'),
        ]);
    }
}
