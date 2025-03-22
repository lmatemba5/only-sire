<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Year;
use App\Models\Month;
use App\Models\Venue;
use App\Models\Bucket;
use App\Http\Resources\Users\UserResource;

abstract class Controller
{
    protected array $props=[];

    protected function currentMonth(){
        $open_at = Carbon::parse(request()->open_at);

        $venue = Venue::where('open_at', 'like', $open_at->format('Y-m-'). '%')->first();

        if (!$venue) {
            $year = Year::where('created_at', 'like', $open_at->format('Y-'). '%')->first();

            if (!$year) {
                $year = Year::create([]);
            }

            $month = Month::where('uuid', $open_at->format('Y-m'))->first();

            if(!$month){
                $month = Month::create([
                    'year_id' => $year->id,
                    'uuid' => $open_at->format('Y-m'),
                ]);
            }
        }else{
            $month = $venue->month;
        }

        return $month;
    }

    protected function data(): array
    {
        $user = request()?->user();
        return [
            'csrf_token' => csrf_token(),
            'api_token' => $user?->api_token,
            'auth' => [
                'user' => new UserResource($user)
            ]
        ];
    }

    protected function check_candidate_no(){
        request()->validate(
            [
                'candidate_no' => 'required|integer|exists:buckets,candidate_no',
            ], [
              "*.exists" => "The number doesn't exist."  
            ]
        );

        $bucket = Bucket::where([
            'candidate_no'=> request()->candidate_no,
            'venue_id' => request()->user()->venue_id,
            'is_submitted' => false
            ])->first();

        if (!$bucket) {
            throw new \Exception("The number doesn't exist.", 404);
        }

        return  $bucket;
    }
}
