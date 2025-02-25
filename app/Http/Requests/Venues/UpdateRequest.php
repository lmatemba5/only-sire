<?php

namespace App\Http\Requests\Venues;

use App\Rules\Venues\MustBeUniqueVenue;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasRole('Country Admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'district_name' => 'required|string',
            'venue_name' => 'required|string',
            'open_at' => ['required','date','after:yesterday', new MustBeUniqueVenue],
        ];
    }
}
