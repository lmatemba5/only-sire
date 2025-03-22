<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class VenueDrive extends Model
{
    use HasFactory;

    /*
        intermediate table
    */

    protected $fillable = [
        'drive_name',
        'drive_description',
        'venue_id',
        'drive_id',
        'google_drive_id',
    ];

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function drive(): HasOne
    {
        return $this->hasOne(Drive::class, 'id', 'drive_id');
    }
}
