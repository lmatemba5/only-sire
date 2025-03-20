<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Validation\Rule;
use App\Jobs\Candidate\CreateGoogleEntry;
use App\Models\Bucket;
use App\Rules\Candidate\MustBeValidLink;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['Interviewer', "Country Admin"]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $tab = $this->tab;

        switch ($tab) {
            case 'personal_details':
                return [
                    'name' => 'required|string|max:50',
                    'age' => 'required|integer|max:100',
                    'marital_status' => 'required|string|max:10',
                    'village' => 'required|string|max:50',
                    'ta' => 'required|string|max:50',
                    'district' => 'required|string|max:50',
                    'email' => 'nullable|string|email|max:100',
                    'phone' => 'required|string|max:50',
                    'gender' => 'required|string|' . Rule::in(['Female', 'Male']),
                ];
            case 'social_media_links':
                return [
                    'facebook_link' => ['nullable', 'string', 'max:500', new MustBeValidLink],
                    'instagram_link' => ['nullable', 'string', 'max:500', new MustBeValidLink],
                    'linkedin_link' => ['nullable', 'string', 'max:500', new MustBeValidLink],
                    'twitter_link' => ['nullable', 'string', 'max:500', new MustBeValidLink],
                    'related_to' => 'nullable|string|max:100',
                ];
            case 'interview_checklist':
                return [
                    "wp" => 'required|integer|max:1|min:0',
                    "pbl" => 'required|integer|max:1||min:0',
                    "a" => 'required|integer|max:1|min:0',
                    "pa" => 'required|integer|max:1|min:0',
                    "ot" => 'required|integer|max:1|min:0',
                ];
            case 'recommendation':
                return [
                    "recommendation" => 'required|string|max:1000',
                    "recommendation_marks" => 'required|string|max:3',
                ];
            
            case "submit":
                return [];
            case 'additional_questions':
                return [
                    "prev_job" => 'nullable|string|max:255',
                    "when_to_start" => 'nullable|string|max:255',
                    "planned_holidays" => 'nullable|string|max:255',
                    "prev_org" => 'nullable|string|max:255',
                    "prev_org_objective" => 'nullable|string|max:255',
                    "iera_friends" => 'nullable|string|max:255',
                    "questions" => 'nullable|string|max:255'
                ];
            default:
                return [
                    "$tab" => 'required|string|max:1000',
                    "$tab" . "_marks" => 'required|string|max:3',
                ];
        }
    }

    public function messages(): array
    {
        return [
            ...parent::messages(),
            '*_marks.required' => 'The score is required',
            '*.required' => 'The field is required',
        ];
    }

    public function saveCandidate()
    {
        $bucket = Bucket::with('candidate')->where('user_id', $this->user()->id)->first();
        $bucket->update(['user_id' => null, 'is_submitted' => true]);

        CreateGoogleEntry::dispatch(
            $bucket->candidate->id,
           $this->conducted_by && strlen($this->conducted_by) > 5 ?  $this->user()->name . ', '.$this->conducted_by: $this->user()->name
        );
    }
}
