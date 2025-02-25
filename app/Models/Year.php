<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Year extends Model
{
    use HasFactory;

    protected $fillable = [
        'google_drive_id',
        'google_workbook_id',
    ];

    public function months(): HasMany
    {
        return $this->hasMany(Month::class, 'year_id');
    }
}
