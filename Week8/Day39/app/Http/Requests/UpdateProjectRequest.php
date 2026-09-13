<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Patched version — see docs/BUGFIXES.md, Bug #1.
 *
 * Fixes a bypass where updating only `end_date` (without also resending
 * `start_date`) skipped the after_or_equal:start_date comparison, because
 * Laravel validates against the request's own input, not the model's
 * existing value.
 */
class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('project'));
    }

    protected function prepareForValidation(): void
    {
        // If the client isn't sending start_date on this request, fall
        // back to the project's current value so the date-range rule
        // below still has something correct to compare against.
        if (! $this->has('start_date') && $this->route('project')) {
            $this->merge([
                'start_date' => $this->route('project')->start_date?->toDateString(),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:planning,active,completed,archived'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            // project_id is intentionally never listed here — see
            // UpdateTaskRequest for the equivalent fix on tasks (Bug #4).
        ];
    }
}
