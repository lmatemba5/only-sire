<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Jobs\Countries\CreateDirectory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Country extends Model
{
    use HasFactory;

    protected $table = "countries";
    protected $fillable = [
        'name',
        'google_drive_id',
        'google_settings_id',
        'continent_id',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public static function booted()
    {
        static::created(function (Country $country) {
            CreateDirectory::dispatch($country->id);
        });
    }
}