<?php

namespace Database\Seeders;

use App\Models\WorkItem;
use Illuminate\Database\Seeder;

class WorkItemSeeder extends Seeder
{
    public function run(): void
    {
        WorkItem::factory(12)->create();
    }
}