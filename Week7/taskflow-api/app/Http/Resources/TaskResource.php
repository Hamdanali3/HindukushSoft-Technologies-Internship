<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * TaskResource
 *
 * Rather than returning raw Eloquent models straight from the
 * controller (which would leak internal columns and make future
 * changes to the database schema a breaking API change), every task
 * is transformed through this API Resource before it is sent to the
 * client. This keeps the "public contract" of the API stable and
 * predictable, which is a core REST principle.
 */
class TaskResource extends JsonResource
{
    /**
     * Transform the resource into a plain array for the JSON response.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'status'      => $this->status,
            'priority'    => $this->priority,
            'due_date'    => $this->due_date,
            'is_overdue'  => $this->is_overdue,
            'user_id'     => $this->user_id,
            'created_at'  => $this->created_at?->toDateTimeString(),
            'updated_at'  => $this->updated_at?->toDateTimeString(),
        ];
    }
}
