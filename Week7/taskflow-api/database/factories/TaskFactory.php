<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    protected static array $samples = [
        ['title' => 'Fix login page validation bug', 'description' => 'Users are able to submit the login form with an empty password field. Add proper client-side and server-side validation.'],
        ['title' => 'Design new dashboard layout', 'description' => 'Create wireframes for the redesigned admin dashboard, focusing on a cleaner sidebar and quicker access to reports.'],
        ['title' => 'Write unit tests for TaskController', 'description' => 'Cover the index, store, update and destroy methods with PHPUnit tests, including validation failure cases.'],
        ['title' => 'Set up CI/CD pipeline', 'description' => 'Configure GitHub Actions to run tests automatically on every pull request before merging into main.'],
        ['title' => 'Optimize database queries', 'description' => 'Review slow queries on the tasks table and add appropriate indexes to improve response time.'],
        ['title' => 'Update API documentation', 'description' => 'Document all new CRUD endpoints, including sample requests and responses, in the project README.'],
        ['title' => 'Refactor authentication middleware', 'description' => 'Simplify the Sanctum token verification logic and add clearer error messages for expired sessions.'],
        ['title' => 'Prepare weekly progress report', 'description' => 'Summarize completed tasks, blockers, and next steps for the internship supervisor meeting.'],
        ['title' => 'Review pull request from teammate', 'description' => 'Check code style, run the test suite, and leave feedback before approving the merge.'],
        ['title' => 'Plan sprint retrospective', 'description' => 'Gather feedback from the team on what went well and what could be improved in the next sprint.'],
        ['title' => 'Migrate legacy user data', 'description' => 'Write a migration script to move existing user records into the new normalized schema.'],
        ['title' => 'Improve mobile responsiveness', 'description' => 'Adjust the task grid layout so cards stack properly on smaller screen sizes.'],
        ['title' => 'Add email notifications', 'description' => 'Send users an email reminder when a task they own is approaching its due date.'],
        ['title' => 'Clean up unused CSS classes', 'description' => 'Audit the stylesheet and remove any selectors no longer referenced in the components.'],
        ['title' => 'Research pagination libraries', 'description' => 'Compare a few React pagination approaches and recommend one for the task list view.'],
    ];

    public function definition(): array
    {
        $sample = $this->faker->randomElement(self::$samples);

        return [
            'title'       => $sample['title'],
            'description' => $sample['description'],
            'status'      => $this->faker->randomElement(Task::STATUSES),
            'priority'    => $this->faker->randomElement(Task::PRIORITIES),
            'due_date'    => $this->faker->boolean(80)
                ? $this->faker->dateTimeBetween('-5 days', '+30 days')->format('Y-m-d')
                : null,
            'user_id'     => null,
        ];
    }
}
