<?php

namespace App\Models;

use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Models\User;

class Bucket extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'venue_id',
        'candidate_id',
        'candidate_no',
        'user_id',
        'ph_google_drive_id',
        'cv_google_drive_id',
        'id_google_drive_id',
        'is_submitted'
    ];

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function clearMediaCollection(string $collectionName = 'default'): HasMedia
    {
        if ($collectionName == 'all') {
            foreach (['id', 'cv', 'ph', 'ce'] as $collection) {
                parent::clearMediaCollection($collection);
            }
        } else {
            parent::clearMediaCollection($collectionName);
        }

        return $this;
    }


    public function registerMediaConversions(?Media $media = null): void
    {
        if ($media?->collection_name === 'ph') {
            $this->addMediaConversion('thumb')
                ->width(200)
                ->height(200)
                ->sharpen(10)->nonQueued();
        }
    }
}
