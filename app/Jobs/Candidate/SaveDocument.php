<?php

namespace App\Jobs\Candidate;

use App\Jobs\QueueJob;
use App\Providers\GoogleService;
use Google\Service\Drive\DriveFile;

class SaveDocument extends QueueJob
{
    public $timeout = 600;
    /**
     * Create a new job instance.
     */
    public function __construct(protected $bucket, protected $google_drive_id, protected $media)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $driveService = (new GoogleService())->getDriveService();

        $fileMetadata = new DriveFile([
            'name' => $this->bucket->candidate_no,
            'parents' => [$this->google_drive_id]
        ]);

        $driveFile = $driveService->files->create($fileMetadata, [
            'data' => stream_get_contents($this->media->stream()),
            'mimeType' => 'image/jpg',
            'uploadType' => 'multipart'
        ],
        [
            'fields' => 'files(id)'
        ]);

        if($this->media->name != 'ce'){
            $this->bucket->update([
                "{$this->media->name}_google_drive_id" => $driveFile->id
            ]);
        }
    }
}
