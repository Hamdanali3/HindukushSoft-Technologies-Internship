<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Patched version — see docs/BUGFIXES.md, Bug #5.
 *
 * Trims the comment body before the `required` rule runs, so a
 * whitespace-only submission ("   ") is correctly rejected instead of
 * creating a visually blank comment.
 */
class StoreCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('task')->project->hasAccess($this->user());
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'body' => is_string($this->body) ? trim($this->body) : $this->body,
        ]);
    }

    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'max:2000'],
        ];
    }
}
