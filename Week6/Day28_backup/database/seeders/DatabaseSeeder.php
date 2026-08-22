<?php
namespace Database\Seeders;
use App\Models\Task; use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder { public function run():void{Task::factory()->count(12)->create();} }
