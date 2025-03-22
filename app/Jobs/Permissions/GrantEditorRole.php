<?php

namespace App\Jobs\Permissions;

use App\Jobs\QueueJob;
use App\Providers\GoogleService;
use App\Models\User;
use Google\Service\Drive\Permission;

class GrantEditorRole extends QueueJob
{    /**
     * Create a new job instance.
     */
    public function __construct(protected array $user_ids = [], protected array $drive_ids=[])
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $driveService = (new GoogleService())->getDriveService();
        
        foreach ($this->user_ids as $user_id) {
            $user_email = User::find($user_id)->email;

            $permissions = new Permission();
            $permissions->setEmailAddress($user_email);
            $permissions->setType('user');
            $permissions->setRole('writer');

            foreach ($this->drive_ids as $drive_id) {
                $driveService->permissions->create($drive_id, $permissions);
            }
        }
    }
}
