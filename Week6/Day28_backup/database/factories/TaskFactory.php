<?php
namespace Database\Factories;
use App\Models\Task; use Illuminate\Database\Eloquent\Factories\Factory;
class TaskFactory extends Factory { protected $model=Task::class; public function definition():array{return ['title'=>fake()->sentence(5),'description'=>fake()->paragraph(),'status'=>fake()->randomElement(['todo','in_progress','done']),'priority'=>fake()->randomElement(['low','normal','high']),'due_date'=>fake()->optional()->dateTimeBetween('now','+30 days')];} }
