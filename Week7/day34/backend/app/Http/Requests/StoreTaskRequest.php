<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * StoreTaskRequest
 *
 * Encapsulates the validation rules for creating a new task.
 * Using a dedicated Form Request (instead of validating inline inside
 * the controller) keeps TaskController::store() lean and makes the
 * validation rules independently reusable and testable.
 */
class StoreTaskRequest extends FormRequest
{
    /**
     * In a production app this would check policies/roles.
     * Authorization itself is layered on properly in Day 34.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status'      => ['nullable', 'in:' . implode(',', Task::STATUSES)],
            'priority'    => ['nullable', 'in:' . implode(',', Task::PRIORITIES)],
            'due_date'    => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }

    /**
     * Human-friendly error messages, shown verbatim to the frontend.
     */
    public function messages(): array
    {
        return [
            'title.required'    => 'Please give the task a title.',
            'title.max'         => 'Task titles can be at most 255 characters.',
            'status.in'         => 'Status must be one of: pending, in_progress, completed.',
            'priority.in'       => 'Priority must be one of: low, medium, high.',
            'due_date.date'     => 'Due date must be a valid date.',
            'due_date.after_or_equal' => 'Due date cannot be in the past.',
        ];
    }

    /**
     * Overriding this ensures that even failed validation returns a
     * consistent, predictable JSON envelope (matching the rest of the
     * API's success responses) instead of Laravel's raw default shape.
     * See Day 35 for the full error-handling strategy this feeds into.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'The given data was invalid.',
            'errors'  => $validator->errors(),
        ], 422));
    }
}
