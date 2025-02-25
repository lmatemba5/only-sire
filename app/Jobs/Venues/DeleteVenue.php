<?php

namespace App\Jobs\Venues;

use App\Jobs\QueueJob;
use App\Providers\GoogleService;

class DeleteVenue extends QueueJob
{
    /**
     * Create a new job instance.
     */
    public function __construct(protected string $google_drive_id, protected string $google_workbook_id, protected string $google_sheet_id)
    {
        $this->queue = findQueue();
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        (new GoogleService())->deleteVenue($this->google_drive_id, $this->google_workbook_id, $this->google_sheet_id);
    }
}
