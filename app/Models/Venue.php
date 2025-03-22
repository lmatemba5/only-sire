<?php

namespace App\Models;

use App\Models\Country;
use App\Casts\AttributeJson;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Jobs\Directories\CreateInterviewDirectories;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'district_name',
        'venue_name',
        'google_drive_id',
        'google_sheet_id',
        'open_at',
        'year_id',
        'month_id',
        'country_id',
    ];

    protected $casts = [
        'open_at' => 'date',
        'verifiers' => AttributeJson::class,
    ];

    public function status(): Attribute
    {
        $days = now()->diffInDays($this->open_at);
        return Attribute::make(
            get: fn() => ($days <= 0 && $days > -1) ? 'Active': ($days < 0 ? 'Closed': 'Pending')
        );
    }

    public function venueDrives(): HasMany
    {
        return $this->hasMany(VenueDrive::class);
    }

    public function team(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function month(): BelongsTo
    {
        return $this->belongsTo(Month::class);
    }

    public function year(): BelongsTo
    {
        return $this->belongsTo(Year::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public static function booted()
    {
        static::created(function (Venue $venue) {
            foreach (Drive::pluck('id')->all() as $drive_id) {
                VenueDrive::create([
                    'venue_id' => $venue->id,
                    'drive_id' => $drive_id,
                ]);
            }

            CreateInterviewDirectories::dispatch($venue->id);
        });
    }
}
