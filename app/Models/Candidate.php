<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'age',
        'gender',
        'marital_status',
        'village',
        'ta',
        'district',
        'email',
        'phone',
        'facebook_link',
        'instagram_link',
        'linkedin_link',
        'twitter_link',
        "related_to",
        'venue_id',
        'user_id'
    ];
    
    public function dawah_attributes(): HasOne
    {
        return $this->hasOne(DawahAttribute::class);
    }

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function bucket(): HasOne
    {
        return $this->hasOne(Bucket::class);
    }
}
