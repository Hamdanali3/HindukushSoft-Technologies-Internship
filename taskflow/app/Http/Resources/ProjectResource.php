<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'owner' => new UserResource($this->whenLoaded('owner')),
            'members' => UserResource::collection($this->whenLoaded('members')),
            'task_count' => $this->whenCounted('tasks'),
            'created_at' => $this->created_at,
        ];
    }
}
