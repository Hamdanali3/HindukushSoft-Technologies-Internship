<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('project_id')
                ->constrained()
                ->cascadeOnDelete();

            // A task can be unassigned (nullable), and if the assignee's
            // account is removed we keep the task but null the assignee
            // out rather than deleting the task itself.
            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('title');
            $table->text('description')->nullable();

            $table->enum('status', ['todo', 'in_progress', 'in_review', 'done'])
                ->default('todo');

            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');

            $table->date('due_date')->nullable();
            $table->timestamps();

            // Composite index: the Kanban board always filters tasks for
            // one project by status, so index the pair together.
            $table->index(['project_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
