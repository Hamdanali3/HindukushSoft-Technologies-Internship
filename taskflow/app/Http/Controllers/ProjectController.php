<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Show every project the logged-in user owns or has been added to.
     *
     * This uses the `visibleTo` scope defined on the Project model so the
     * "who can see what" rule is written once and reused everywhere
     * (index page here, and later the API index endpoint on Day 38).
     */
    public function index(Request $request)
    {
        $projects = Project::visibleTo($request->user())
            ->withCount('tasks')
            ->latest()
            ->paginate(10);

        return view('projects.index', compact('projects'));
    }

    public function create()
    {
        return view('projects.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:planning,active,completed,archived'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        $project = Project::create([
            ...$validated,
            'owner_id' => $request->user()->id,
        ]);

        // The owner is also added as a "manager" member row so they show
        // up in member listings the same way any other manager would.
        $project->members()->attach($request->user()->id, ['role' => 'manager']);

        return redirect()
            ->route('projects.show', $project)
            ->with('status', "Project \"{$project->name}\" created.");
    }

    public function show(Request $request, Project $project)
    {
        abort_unless($project->hasAccess($request->user()), 403);

        $project->load(['owner', 'members', 'tasks.assignee']);

        $tasksByStatus = $project->tasks->groupBy('status');

        return view('projects.show', compact('project', 'tasksByStatus'));
    }

    public function edit(Request $request, Project $project)
    {
        abort_unless($project->owner_id === $request->user()->id, 403);

        return view('projects.edit', compact('project'));
    }

    public function update(Request $request, Project $project)
    {
        abort_unless($project->owner_id === $request->user()->id, 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:planning,active,completed,archived'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        $project->update($validated);

        return redirect()
            ->route('projects.show', $project)
            ->with('status', 'Project updated.');
    }

    public function destroy(Request $request, Project $project)
    {
        abort_unless($project->owner_id === $request->user()->id, 403);

        $project->delete();

        return redirect()
            ->route('projects.index')
            ->with('status', "Project \"{$project->name}\" deleted.");
    }
}
