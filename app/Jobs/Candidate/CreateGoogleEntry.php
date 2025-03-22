<?php

namespace App\Jobs\Candidate;

use App\Jobs\QueueJob;
use App\Providers\GoogleService;

class CreateGoogleEntry extends QueueJob
{

    public function __construct(protected int $candidate_id, protected string $creatorName)
    {
        $this->queue = findQueue();
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        (new GoogleService($this->candidate_id, $this->creatorName))->saveCandidate2Cloud();
        RenameDocument::dispatch($this->candidate_id)->onQueue($this->queue);
    }
}
