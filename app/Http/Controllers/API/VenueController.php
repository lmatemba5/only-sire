<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Venues\StoreRequest;
use App\Http\Requests\Venues\UpdateRequest;
use App\Http\Resources\Venues\VenueResource;
use App\Jobs\Venues\DeleteVenue;
use App\Models\Venue;
use App\Models\Year;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VenueController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $venues = Venue::with('team', 'venueDrives', 'venueDrives.drive')->where([
            'year_id' => Year::latest()?->first()?->id,
            'country_id' => $request->user()->country_id,
        ])->orderBy('open_at')->paginate(5);

        return VenueResource::collection($venues);
    }

    public function show(Venue $venue): VenueResource
    {
        return new VenueResource($venue);
    }

    public function store(StoreRequest $request): VenueResource
    {
        $month = $this->currentMonth();

        $venue = Venue::create([
             ...$request->validated(),
            'month_id' => $month->id,
            'year_id' => $month->year_id,
            'country_id' => $month->country_id,
        ]);

        return new VenueResource($venue);
    }

    public function update(UpdateRequest $request, Venue $venue): VenueResource
    {
        $month = $this->currentMonth();

        $venue->update([
             ...$request->validated(),
            'month_id' => $month->id,
            'year_id' => $month->year->id,
        ]);

        return new VenueResource($venue);
    }

    public function destroy(Venue $venue): JsonResponse
    {
        if(!$venue){
            return new JsonResponse(null, 404);
        }

        DeleteVenue::dispatch($venue->google_drive_id, $venue->year->google_workbook_id, $venue->google_sheet_id);
        $venue->delete();

        return new JsonResponse();
    }

    public function create()
    {
        $venues = Venue::where('country_id', request()->user()->country_id)->orderBy('open_at')->paginate(5);

        if(!request()->user()->hasAnyRole(['Country Admin', 'Root'])){
            return redirect('/interviews');
        }

        return view('pages.country-admin.venues', [
            'data' => [
                'activeTab' => 'venues',
                ...$this->data(),
                'users' => User::where("country_id", request()->user()->country_id)->select('id', 'name')->get(),
                'venues' => [
                    'data' => VenueResource::collection($venues),
                    'links' => $venues->links()
                ],

            ],
        ]);
    }
}
