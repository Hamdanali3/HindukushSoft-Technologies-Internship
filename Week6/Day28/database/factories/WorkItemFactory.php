<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WorkItem>
 */
class WorkItemFactory extends Factory
{
    public function definition(): array
    {
        $titles = [
            'Design project dashboard',
            'Implement user authentication',
            'Review database structure',
            'Create API documentation',
            'Fix responsive layout issues',
            'Develop task management module',
            'Optimize database queries',
            'Implement search functionality',
            'Prepare project documentation',
            'Test application workflow',
        ];

        $descriptions = [
            'Design and implement a clean dashboard for managing project activities and work items.',
            'Implement secure user authentication and ensure that protected routes are properly configured.',
            'Review the existing database structure and improve relationships, indexes, and overall performance.',
            'Create clear and professional API documentation for the development team.',
            'Identify and fix responsive layout issues across desktop, tablet, and mobile screen sizes.',
            'Develop a complete task management module with creation, editing, viewing, and deletion features.',
            'Analyze database queries and optimize them to improve application performance.',
            'Implement a reliable search feature that allows users to quickly find relevant work items.',
            'Prepare professional technical documentation describing the project architecture and workflow.',
            'Perform functional testing and verify that all major application workflows operate correctly.',
        ];

        return [
            'title' => fake()->randomElement($titles),
            'description' => fake()->randomElement($descriptions),
            'status' => fake()->randomElement([
                'pending',
                'in_progress',
                'completed',
            ]),
            'priority' => fake()->randomElement([
                'low',
                'medium',
                'high',
            ]),
            'due_date' => fake()->optional(0.8)->dateTimeBetween(
                'now',
                '+30 days'
            ),
        ];
    }
}