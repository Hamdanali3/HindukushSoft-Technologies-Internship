<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    private function projectWithMember(): array
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();
        $project = Project::factory()->create(['owner_id' => $owner->id]);
        $project->members()->attach($member->id, ['role' => 'member']);

        return [$owner, $member, $project];
    }

    public function test_a_project_member_can_create_a_task(): void
    {
        [$owner, $member, $project] = $this->projectWithMember();

        $response = $this->actingAs($member, 'sanctum')->postJson("/api/projects/{$project->id}/tasks", [
            'title' => 'Write onboarding docs',
            'priority' => 'high',
        ]);

        $response->assertCreated()->assertJsonPath('title', 'Write onboarding docs');

        $this->assertDatabaseHas('tasks', [
            'project_id' => $project->id,
            'title' => 'Write onboarding docs',
            'status' => 'todo', // default from the migration
        ]);
    }

    public function test_a_task_cannot_be_created_with_an_invalid_status(): void
    {
        [$owner, $member, $project] = $this->projectWithMember();

        $response = $this->actingAs($member, 'sanctum')->postJson("/api/projects/{$project->id}/tasks", [
            'title' => 'Broken task',
            'status' => 'not_a_real_status',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('status');
    }

    public function test_a_regular_member_can_update_but_not_delete_a_task(): void
    {
        [$owner, $member, $project] = $this->projectWithMember();

        $task = $project->tasks()->create([
            'title' => 'Draft release notes',
            'status' => 'todo',
            'priority' => 'medium',
        ]);

        $this->actingAs($member, 'sanctum')
            ->putJson("/api/tasks/{$task->id}", ['status' => 'in_progress'])
            ->assertOk()
            ->assertJsonPath('status', 'in_progress');

        $this->actingAs($member, 'sanctum')
            ->deleteJson("/api/tasks/{$task->id}")
            ->assertForbidden();

        $this->actingAs($owner, 'sanctum')
            ->deleteJson("/api/tasks/{$task->id}")
            ->assertNoContent();
    }

    public function test_a_user_outside_the_project_cannot_see_its_tasks(): void
    {
        [$owner, $member, $project] = $this->projectWithMember();
        $outsider = User::factory()->create();

        $project->tasks()->create(['title' => 'Private task', 'status' => 'todo', 'priority' => 'low']);

        $this->actingAs($outsider, 'sanctum')
            ->getJson("/api/projects/{$project->id}/tasks")
            ->assertForbidden();
    }

    public function test_overdue_tasks_are_flagged_correctly(): void
    {
        [$owner, $member, $project] = $this->projectWithMember();

        $overdue = $project->tasks()->create([
            'title' => 'Late task', 'status' => 'todo', 'priority' => 'high',
            'due_date' => now()->subDays(2),
        ]);

        $notOverdueBecauseDone = $project->tasks()->create([
            'title' => 'Finished late but done', 'status' => 'done', 'priority' => 'high',
            'due_date' => now()->subDays(2),
        ]);

        $this->assertTrue($overdue->fresh()->isOverdue());
        $this->assertFalse($notOverdueBecauseDone->fresh()->isOverdue());
    }
}
