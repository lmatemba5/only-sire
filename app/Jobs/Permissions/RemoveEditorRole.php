<?php

namespace App\Jobs\Permissions;

use App\Jobs\QueueJob;
use App\Providers\GoogleService;
use App\Models\User;

class RemoveEditorRole extends QueueJob
{
    /**
     * Create a new job instance.
     */
    public function __construct(protected int $user_id,  protected array $drive_ids=[])
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $driveService = (new GoogleService())->getDriveService();
        $user = User::find($this->user_id);

        foreach ($this->drive_ids as $drive_id) {

            $folder_permissions = $driveService->files->get($drive_id, [
                'fields' => 'permissions'
            ])->getPermissions();

            //revoking user permission on this folder         
            foreach ($folder_permissions as $permission) {
                if ($permission->getEmailAddress() == $user->email && $user->email != email()) {
                    $driveService->permissions->delete($drive_id, $permission->getId());
                    break;
                }
            }
        }
    }
}
