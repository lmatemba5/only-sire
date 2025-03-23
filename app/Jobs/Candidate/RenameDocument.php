<?php

namespace App\Jobs\Candidate;

use App\Jobs\QueueJob;
use App\Providers\GoogleService;
use App\Models\Candidate;
use Google\Service\Drive\DriveFile;

class RenameDocument extends QueueJob
{
    /**
     * Create a new job instance.
     */
    public function __construct(protected int $candidate_id)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $candidate = Candidate::find($this->candidate_id);
        $driveService = (new GoogleService())->getDriveService();

        $newFileAttr = new DriveFile([
            'name' => $candidate->name
        ]);

        $bucket = $candidate->bucket;

        $driveService->files->update($bucket->id_google_drive_id, $newFileAttr);
        $driveService->files->update($bucket->cv_google_drive_id, $newFileAttr);
        $driveService->files->update($bucket->ph_google_drive_id, $newFileAttr);


        $certificates_gdrive_id =$candidate->venue->venueDrives()->where('drive_id', 6)->first()->google_drive_id;

        $certificates = $driveService->files->listFiles([
            'spaces' => 'drive',
            'q' => "name='{$bucket->candidate_no}' and '{$certificates_gdrive_id}' in parents",
            'fields' => 'files(id,name)',
        ])->getFiles();

        foreach ($certificates as $cert) {
            if($cert->name == $bucket->candidate_no){
                $driveService->files->update($cert->id, $newFileAttr);
            }
        }

        $bucket->clearMediaCollection('all');

        $bucket->delete();
    }
}
