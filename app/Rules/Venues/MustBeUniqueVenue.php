<?php

namespace App\Rules\Venues;

use Closure;
use Carbon\Carbon;
use App\Models\Venue;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;

class MustBeUniqueVenue implements ValidationRule, DataAwareRule
{
    protected $data = [];
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $venue = Venue::whereDate('open_at', Carbon::parse($this->data['open_at'])->toDateString())->first();
        
        if($venue && $venue->district_name == $this->data['district_name'] && $venue->venue_name == $this->data['venue_name']){
            $fail("The venue already exists.");
        }
    }

    public function setData(array $data): static
    {
        $this->data = $data;
        return $this;
    }
}