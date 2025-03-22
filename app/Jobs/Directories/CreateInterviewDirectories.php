<?php

namespace App\Jobs\Directories;

use App\Jobs\QueueJob;
use App\Providers\GoogleService;

class CreateInterviewDirectories extends QueueJob
{
    /**
     * Create a new job instance.
     */
    public function __construct(protected int $venue_id)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        (new GoogleService(null, null, $this->venue_id))->createInterviewDirectories();
    }
}
