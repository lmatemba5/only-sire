<?php

namespace App\Jobs\Candidate;

use App\Jobs\QueueJob;
use App\Models\Bucket;

class SaveDocumentManager extends QueueJob
{
    public $timeout = 600;
    /**
     * Create a new job instance.
     */
    public function __construct(protected $bucket_id){
        $this->queue = findQueue();
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $collection_names = ['id', 'cv', 'ph', 'ce'];

        $bucket = Bucket::find($this->bucket_id);
        $venueDrives = $bucket->venue->venueDrives;

        foreach ($collection_names as $collection_name) {
            $target_google_drive_id = null;

            foreach ($venueDrives as $venueDrive) {
                if ($venueDrive->drive->tag == $collection_name) {
                    $target_google_drive_id = $venueDrive->google_drive_id;
                    break;
                }
            }

            foreach ($bucket->getMedia($collection_name) as $media) {
                SaveDocument::dispatch(
                    $bucket,
                    $target_google_drive_id,
                    $media->id
                )->onQueue($this->queue);
            }
        }
    }
}
