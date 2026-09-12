<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: create_tasks_table
 *
 * This migration builds the core "tasks" table that powers the TaskFlow
 * API used throughout Week 7 (Day 31 - Day 35).
 *
 * Design notes:
 *  - status / priority are implemented as simple string enums (validated
 *    at the application layer) rather than native DB enums, because
 *    string-based enums are far easier to migrate/extend later and are
 *    the recommended approach in modern Laravel projects.
 *  - due_date is nullable because not every task necessarily has a
 *    deadline attached to it.
 *  - user_id is included here (nullable, no FK yet) so the schema is
 *    already forward-compatible with Day 34's authentication work,
 *    where every task will be scoped to the user who owns it.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('pending'); // pending | in_progress | completed
            $table->string('priority')->default('medium'); // low | medium | high
            $table->date('due_date')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();

            // Index commonly filtered columns for query performance.
            $table->index('status');
            $table->index('priority');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
