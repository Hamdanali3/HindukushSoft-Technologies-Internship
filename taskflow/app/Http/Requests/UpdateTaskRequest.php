<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Patched version — see docs/BUGFIXES.md, Bug #4.
 *
 * `project_id` is deliberately absent from the rules below. Since
 * $request->validated() only returns keys listed in rules(), a malicious
 * or accidental `project_id` in the request body is silently dropped and
 * never reaches Task::update() — a task cannot be moved to a project the
 * user was never authorized against.
 */
class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('task'));
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:todo,in_progress,in_review,done'],
            'priority' => ['sometimes', 'in:low,medium,high'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'due_date' => ['nullable', 'date'],
        ];
    }
}
