<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Candidate\StoreRequest;
use App\Http\Requests\Scanning\StoreRequest as ScanningStoreRequest;
use App\Models\Bucket;
use App\Models\Candidate;
use App\Models\DawahAttribute;
use App\Providers\GoogleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InterviewController extends Controller
{
    public function store(StoreRequest $request): JsonResponse
    {
        $candidate_id = Bucket::where(['user_id' => $request->user()->id, 'is_submitted' => false])->first()->candidate_id;

        switch ($request->tab) {
            case 'personal_details':
            case 'social_media_links':
                Candidate::updateOrCreate(
                    ['id' => $candidate_id],
                    $request->validated()
                );
                break;
            case 'interview_checklist':
                DawahAttribute::updateOrCreate(
                    ['candidate_id' => $candidate_id],
                    [
                        'checklist->wp' => $request->wp,
                        'checklist->pbl' => $request->pbl,
                        'checklist->pa' => $request->pa,
                        'checklist->a' => $request->a,
                        'checklist->ot' => $request->ot,
                    ]
                );
                break;
            case 'recommendation':
                DawahAttribute::updateOrCreate(
                    ['candidate_id' => $candidate_id],
                    [
                        'recommendation->text' => $request->recommendation,
                        'recommendation->marks' => $request->recommendation_marks,
                    ]
                );
                break;
            case 'submit':
                $request->saveCandidate();
                break;
            case 'additional_questions':
                DawahAttribute::updateOrCreate(
                    ['candidate_id' => $candidate_id],
                    [
                        "addition_questions->prev_job" => $request->prev_job,
                        "addition_questions->when_to_start" => $request->when_to_start,
                        "addition_questions->planned_holidays" => $request->planned_holidays,
                        "addition_questions->prev_org" => $request->prev_org,
                        "addition_questions->prev_org_objective" => $request->prev_org_objective,
                        "addition_questions->iera_friends" => $request->iera_friends,
                        "addition_questions->questions" => $request->questions,
                    ]
                );
                break;
            default:
                DawahAttribute::updateOrCreate(
                    ['candidate_id' => $candidate_id],
                    [
                        "{$request->tab}->text" => $request["{$request->tab}"],
                        "{$request->tab}->marks" => $request["{$request->tab}_marks"],
                    ]
                );
                break;
        }

        return new JsonResponse();
    }

    public function generate_candidate_no(ScanningStoreRequest $request): JsonResponse
    {
        $candidate_no = (new GoogleService())->createCandidateBucket($request);

        return new JsonResponse([
            'candidate_no' => $candidate_no,
        ]);
    }

    public function show(Request $request, $user_id): JsonResponse
    {
        if ($user_id != $request->user()->id) {
            return new JsonResponse([
                'message' => "Forbidden, the action will be reported."
            ], 403);
        }

        return new JsonResponse([
            'venues' => $request->user()->venues()->select('venues.id', 'district_name', 'venue_name')->get()
        ]);
    }

    public function validate_candidate_no(): JsonResponse
    {
        $bucket = $this->check_candidate_no();

        return new JsonResponse([
            'photo_url' => $bucket->getMedia('ph')->first()->getUrl('thumb')
        ]);
    }

    public function create_new_candidate(Request $req): JsonResponse
    {
        $bucket = $this->check_candidate_no();

        $candidate = Candidate::create([
            'user_id' => $req->user()->id,
            'venue_id' => $bucket->venue_id,
        ]);

        $bucket->update([
            'candidate_id' => $candidate->id,
            'user_id' => $candidate->user_id,
        ]);

        return new JsonResponse();
    }

    public function create(Request $request)
    {
        $bucket = Bucket::where(['user_id' => $request->user()->id, 'is_submitted' => false])->first();
        $candidateData = null;

        if ($bucket) {

            $candidateData = [];
            $candidate = $bucket->candidate;

            $rawData = [
                ...($candidate->dawah_attributes ?
                    $candidate->dawah_attributes->makeHidden(['created_at', 'updated_at', 'candidate_id', 'id'])
                    ->toArray() :
                    [])
            ];

            foreach ($rawData as $key => $obj) {
                $dataValues = (array) $obj;

                if ($key != 'checklist' && $key != 'addition_questions') {
                    foreach ($dataValues as $child_key => $value) {
                        if (str_starts_with($child_key, 'tex')) {
                            $candidateData[$key] = $dataValues[$child_key];
                        } else {
                            $candidateData["{$key}_marks"] = $dataValues[$child_key];
                        }
                    }
                } else {
                    foreach ($dataValues as $child_key => $value) {
                        $candidateData[$child_key] = $value;
                    }
                }
            }

            $candidateData = [
                ...$candidateData,
                ...$candidate->makeHidden([
                    'created_at',
                    'updated_at',
                    'id',
                    'user_id',
                    'venue_id',
                    'dawah_attributes'
                ])->toArray(),
            ];
        }

        return view('pages.interviewer.interviews', [
            'data' => [
                'activeTab' => 'interviews',
                'candidate' => $candidateData,
                'venues' => $request->user()->venues()->select('venues.id', 'district_name', 'venue_name')->get(),
                ...$this->data()
            ],
        ]);
    }

    public function updateMyVenue(Request $request): JsonResponse
    {
        $request->validate([
            'venue_id' => 'required|integer|exists:venues,id',
        ]);

        $request->user()->update([
            'venue_id' => $request->venue_id,
        ]);

        return new JsonResponse();
    }

    public function destroy_temporary_candidate(): JsonResponse
    {
        $bucket = Bucket::where(['user_id' => request()->user()->id, 'is_submitted' => false])->first();

        if (!$bucket) {
            return new JsonResponse(null, 404);
        }

        $bucket->candidate->delete();
        $bucket->update([
            'user_id' => null,
            'candidate_id' => null
        ]);

        return new JsonResponse();
    }
}
