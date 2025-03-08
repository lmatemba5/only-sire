<?php

namespace App\Jobs\Candidate;

use App\Jobs\QueueJob;
use App\Models\Media;
use App\Providers\GoogleService;
use Google\Service\Drive\DriveFile;

class SaveDocument extends QueueJob
{
    public $timeout = 600;
    /**
     * Create a new job instance.
     */
    public function __construct(protected $bucket, protected $google_drive_id, protected $media_id)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $driveService = (new GoogleService())->getDriveService();

        $media = Media::find($this->media_id);
        $fileMetadata = new DriveFile([
            'name' => $this->bucket->candidate_no,
            'parents' => [$this->google_drive_id]
        ]);

        $driveFile = $driveService->files->create($fileMetadata, [
            'data' => file_get_contents($media->getPath()),
            'mimeType' => 'image/jpg',
            'uploadType' => 'multipart'
        ],
        [
            'fields' => 'files(id)'
        ]);

        if($media->name != 'ce'){
            $this->bucket->update([
                "{$media->name}_google_drive_id" => $driveFile->id
            ]);
        }
    }
}
