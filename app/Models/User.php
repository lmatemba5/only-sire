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
use App\Providers\GoogleService;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    protected $gmailService;

    public function __construct(array $attributes = [])
    {
        $this->gmailService = new GoogleService();
        parent::__construct($attributes);
    }

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
        if ($this->email == 'ibrahimmaulanah01@gmail.com') {
            return Team::join('venues', 'venues.id', 'teams.venue_id')
                ->where('teams.user_id', $this->id)
                ->where('venues.open_at', 'like',  "%" . now()->format('Y-m-') . "%")
                ->where('venues.country_id', $this->country_id);
        }

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
            $password = /*Str::random(10)*/ $user->email;

            $user->update(['password' => bcrypt($password)]);

            /*$email = new CredentialsNotification($user, $password);

            $user->gmailService->sendEmail($user->email, 'Interview System Login Details',  $email->render());*/
        });
    }
}
