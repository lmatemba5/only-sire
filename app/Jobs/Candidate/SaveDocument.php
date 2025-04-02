<?php

namespace App\Jobs\Candidate;

use App\Jobs\QueueJob;
use App\Models\Media;
use App\Providers\GoogleService;
use Google\Service\Drive\DriveFile;
use Barryvdh\DomPDF\Facade\Pdf;

class SaveDocument extends QueueJob
{
    public $timeout = 600;
    /**
     * Create a new job instance.
     */
    public function __construct(protected $bucket, protected $google_drive_id, protected $media) {}

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

        if (!$this->media) {
            $pdf = Pdf::loadView('pdfs.generate-cv', ['bucket' => $this->bucket]);
            $pdf->setPaper('A4', 'portrait');
            $cv_temp_storage_path = storage_path('app/public/temp-cv.pdf');
            $pdf->save($cv_temp_storage_path);

            $cv = $this->bucket->addMedia($cv_temp_storage_path)->usingName('cv')->usingFileName('cv.pdf')->toMediaCollection('cv');
            
            $this->media =  $cv;
        }

        $driveFile = $driveService->files->create(
            $fileMetadata,
            [
                'data' => file_get_contents($this->media->getPath()),
                'mimeType' => $this->media->mime_type,
                'uploadType' => 'multipart'
            ],
            [
                'fields' => 'files(id)'
            ]
        );

        if ($this->media->mime_type == 'application/pdf' || ($this->media->name != 'ce' && $this->media->name != 'cv')) {
            $this->bucket->update([
                "{$this->media->name}_google_drive_id" => $driveFile->id
            ]);
        }
    }
}
