<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Mail\CredentialsNotification;
use App\Models\Team;
use Illuminate\Support\{Str, Facades\Mail};

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    protected $fillable = [
        'name',
        'email',
        'avatar',
        'venue_id',
        'country_id',
        'isLocked',
        'password',
        'api_token'
    ];

    public function venues()
    {
        return Team::join('venues', 'venues.id', 'teams.venue_id')
        ->where('teams.user_id', $this->id)
        ->where('venues.open_at', now()->format('Y-m-d'));
    }

    public function isAdmin(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->hasRole('Administrator')
        );
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'remember_token',
        'password',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public static function booted()
    {
        static::created(function (User $user) {
            $password = Str::random(10);
            
            $user->update(['password' => bcrypt($password)]);

            Mail::to($user->email)->send(
                new CredentialsNotification($user, $password)
            );
        });
    }
}
