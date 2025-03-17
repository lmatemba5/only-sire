<?php

namespace App\Rules\Candidate;

use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;

class MustBeValidLink implements ValidationRule, DataAwareRule
{
    protected $data = [];
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if($value && !str_starts_with($value, 'http') ){
            $fail("The link is invalid.");
        }
    }

    public function setData(array $data): static
    {
        $this->data = $data;
        return $this;
    }
}