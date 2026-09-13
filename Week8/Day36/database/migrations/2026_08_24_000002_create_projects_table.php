<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();

            // Every project has exactly one owner. If the owning account is
            // deleted we cascade, since an ownerless project has no
            // meaningful access-control path in this design.
            $table->foreignId('owner_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('status', ['planning', 'active', 'completed', 'archived'])
                ->default('planning');

            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
