<?php

namespace App\Http\Requests\Scanning;

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
        return [
            'ce*' => 'nullable|file',
            'cv' => 'required|file',
            'id' => 'required|file',
            'ph' => 'required|file',
            'venue_id' => 'required'
        ];
    }
}
