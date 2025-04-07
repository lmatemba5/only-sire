<?php

namespace App\Http\Resources\Venues;

use App\Http\Resources\Folders\FolderResource;
use App\Http\Resources\TeamResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VenueResource extends JsonResource
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
            'name' => $this->district_name.', '.$this->venue_name,
            'open_at' => $this->open_at->format('d-m-Y'),
            'open_at_date' => $this->open_at->format('d F, Y'),
            'drive_link' => $this->google_drive_id,
            'sheet_id' => $this->google_sheet_id,
            'db_link' => $this->year->google_workbook_id,
            'status' => $this->status,
            'team' => TeamResource::collection($this->team),
            'folders' => FolderResource::collection(
                $this->venueDrives()->get()
            )
        ];
    }
}
