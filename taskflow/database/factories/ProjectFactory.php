<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'owner_id' => User::factory(),
            'status' => 'planning',
            'start_date' => now()->toDateString(),
            'end_date' => null,
        ];
    }
}