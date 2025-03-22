<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\StoreRequest;
use App\Http\Resources\TeamResource;
use App\Jobs\Permissions\GrantEditorRole;
use App\Jobs\Permissions\RemoveEditorRole;
use App\Models\Team;
use App\Models\Venue;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    public function store(StoreRequest $request): TeamResource
    {
        $team = Team::updateOrCreate([
            'user_id' => $request->user_id,
            'venue_id' => $request->venue_id,
        ], [
            'is_verifier' => $request->is_verifier,
        ]);

        $venue = Venue::find($request->venue_id);

        switch ($request->is_verifier) {
            case 1:
                GrantEditorRole::dispatch([$request->user_id], [$venue->google_drive_id, $venue->year->google_workbook_id]);
                break;
            default:
                GrantEditorRole::dispatch([$request->user_id], [$venue->google_drive_id]);
                break;
        }

        return new TeamResource($team);
    }

    public function destroy(Team $team): JsonResponse
    {
        $venue = Venue::find($team->venue_id);

        switch ($team->is_verifier) {
            case 1:
                RemoveEditorRole::dispatch($team->user_id, [$venue->google_drive_id,$venue->year->google_workbook_id]);
                break;
            default:
                RemoveEditorRole::dispatch($team->user_id, [$venue->google_drive_id]);
                break;
        }

        $team->delete();

        return new JsonResponse();
    }
}
