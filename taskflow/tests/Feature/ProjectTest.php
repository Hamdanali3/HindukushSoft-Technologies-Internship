<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_create_a_project_and_becomes_its_owner(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/projects', [
            'name' => 'Website Redesign',
            'description' => 'Rebuild the marketing site.',
            'status' => 'planning',
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('projects', [
            'name' => 'Website Redesign',
            'owner_id' => $user->id,
        ]);

        // Creating a project should also seat the owner as a member row,
        // not just set owner_id — this was one of the bugs caught below
        // (see BUGFIXES.md, Bug #2).
        $this->assertDatabaseHas('project_user', [
            'user_id' => $user->id,
            'role' => 'manager',
        ]);
    }

    public function test_a_user_cannot_view_a_project_they_do_not_belong_to(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();

        $project = Project::factory()->create(['owner_id' => $owner->id]);

        $response = $this->actingAs($stranger, 'sanctum')->getJson("/api/projects/{$project->id}");

        $response->assertForbidden();
    }

    public function test_a_project_member_can_view_the_project(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();

        $project = Project::factory()->create(['owner_id' => $owner->id]);
        $project->members()->attach($member->id, ['role' => 'member']);

        $response = $this->actingAs($member, 'sanctum')->getJson("/api/projects/{$project->id}");

        $response->assertOk()->assertJsonPath('id', $project->id);
    }

    public function test_only_the_owner_can_update_the_project(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();

        $project = Project::factory()->create(['owner_id' => $owner->id]);
        $project->members()->attach($member->id, ['role' => 'member']);

        $this->actingAs($member, 'sanctum')
            ->putJson("/api/projects/{$project->id}", ['name' => 'Hijacked Name'])
            ->assertForbidden();

        $this->actingAs($owner, 'sanctum')
            ->putJson("/api/projects/{$project->id}", ['name' => 'Renamed Correctly'])
            ->assertOk();

        $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'Renamed Correctly']);
    }

    public function test_deleting_a_project_cascades_and_removes_its_tasks(): void
    {
        $owner = User::factory()->create();
        $project = Project::factory()->create(['owner_id' => $owner->id]);
        $task = $project->tasks()->create([
            'title' => 'Set up CI',
            'status' => 'todo',
            'priority' => 'medium',
        ]);

        $this->actingAs($owner, 'sanctum')
            ->deleteJson("/api/projects/{$project->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
}
