<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_register_via_the_api(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Ayesha Khan',
            'email' => 'ayesha@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'role'], 'token']);

        $this->assertDatabaseHas('users', [
            'email' => 'ayesha@example.com',
            'role' => 'member', // new accounts must never default to admin/manager
        ]);
    }

    public function test_registration_fails_with_a_duplicate_email(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Second User',
            'email' => 'taken@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_a_user_can_log_in_with_correct_credentials(): void
    {
        $user = User::factory()->create(['password' => bcrypt('correct-password')]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'correct-password',
        ]);

        $response->assertOk()->assertJsonStructure(['user', 'token']);
    }

    public function test_login_fails_with_wrong_password_and_does_not_leak_which_field_was_wrong(): void
    {
        $user = User::factory()->create(['password' => bcrypt('correct-password')]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_an_authenticated_user_can_fetch_their_own_profile(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/user');

        $response->assertOk()->assertJsonPath('id', $user->id);
    }
}
