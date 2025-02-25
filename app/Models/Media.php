<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatiMedia;

class Media extends SpatiMedia
{
    use HasFactory;
}
