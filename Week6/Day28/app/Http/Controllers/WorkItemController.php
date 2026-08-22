<?php

namespace App\Http\Controllers;

use App\Models\WorkItem;
use Illuminate\Http\Request;

class WorkItemController extends Controller
{
    /**
     * Display a listing of work items.
     */
    public function index()
    {
        $workItems = WorkItem::latest()->paginate(10);

        return view('work-items.index', compact('workItems'));
    }

    /**
     * Show the form for creating a new work item.
     */
    public function create()
    {
        return view('work-items.create');
    }

    /**
     * Store a newly created work item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,in_progress,completed'],
            'priority' => ['required', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date'],
        ]);

        WorkItem::create($validated);

        return redirect()
            ->route('work-items.index')
            ->with('success', 'Work item created successfully.');
    }

    /**
     * Display the specified work item.
     */
    public function show(WorkItem $workItem)
    {
        return view('work-items.show', compact('workItem'));
    }

    /**
     * Show the form for editing the specified work item.
     */
    public function edit(WorkItem $workItem)
    {
        return view('work-items.edit', compact('workItem'));
    }

    /**
     * Update the specified work item.
     */
    public function update(Request $request, WorkItem $workItem)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,in_progress,completed'],
            'priority' => ['required', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date'],
        ]);

        $workItem->update($validated);

        return redirect()
            ->route('work-items.index')
            ->with('success', 'Work item updated successfully.');
    }

    /**
     * Remove the specified work item.
     */
    public function destroy(WorkItem $workItem)
    {
        $workItem->delete();

        return redirect()
            ->route('work-items.index')
            ->with('success', 'Work item deleted successfully.');
    }
}