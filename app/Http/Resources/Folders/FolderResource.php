<?php

namespace App\Http\Resources\Folders;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FolderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this?->drive_name ?: $this->drive->name,
            'description' => $this?->drive_description ?: $this->drive->description,
        ];
    }
}
