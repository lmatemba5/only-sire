<?php

namespace App\Http\Resources\Users;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'country' => $this->country->name,
            'country_id' => $this->country->id,
            'isLocked' => $this->isLocked,
            'role' => $this->roles()->first()->name,
            'venue_id' => $this->venue_id,
        ];
    }
}
