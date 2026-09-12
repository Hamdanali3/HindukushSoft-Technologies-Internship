<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * UpdateTaskRequest
 *
 * Validation rules for editing an existing task. Fields are marked
 * "sometimes" so that PATCH-style partial updates are supported —
 * the client can send only the fields that changed instead of the
 * entire object every time.
 */
class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status'      => ['sometimes', 'in:' . implode(',', Task::STATUSES)],
            'priority'    => ['sometimes', 'in:' . implode(',', Task::PRIORITIES)],
            'due_date'    => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Task title cannot be empty.',
            'status.in'       => 'Status must be one of: pending, in_progress, completed.',
            'priority.in'     => 'Priority must be one of: low, medium, high.',
            'due_date.date'   => 'Due date must be a valid date.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'The given data was invalid.',
            'errors'  => $validator->errors(),
        ], 422));
    }
}
