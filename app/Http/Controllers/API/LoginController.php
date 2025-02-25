<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Country;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\LoginResource;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Auth\LoginRequest;
use Laravel\Socialite\Facades\Socialite;

class LoginController extends Controller
{

    public function create(){
        return view('pages.login', [
            'data' => [
                'csrf_token' => csrf_token()
            ]
        ]);
    }
    /**
     * Handle an incoming authentication request.
     */
    public function google_login(Request $request): RedirectResponse
    {
        $socialiteUser = Socialite::driver('google')->user();

        $user = User::where('email', $socialiteUser->getEmail())->first();
        $country = null;

        if (!$user) {
            $fromCountry = countryName();

            $country = Country::where('name', $fromCountry);

            if ($country->count() == 0) {
                $country = Country::create([
                    'name' => $fromCountry,
                ]);
            } else {
                $country = $country->first();
            }

            $user = User::create([
                'country_id' => $country->id,
                'name' => $socialiteUser->getName(),
                'email' => $socialiteUser->getEmail(),
                'email_verified_at' => now(),
                'avatar' => explode('a/', $socialiteUser->getAvatar())[1],
                'remember_token' => Str::random(10),
            ]);

            if ($user->email == email()) {
                $user->syncRoles(['Country Admin']);
            } else {
                $user->syncRoles(['Interviewer']);
            }
        } else {
            if ($user->name != $socialiteUser->getName()) {
                $user->update([
                    'name' => $socialiteUser->getName(),
                ]);
            }
        }

        $user->update([
            'venue_id' => null,
            'api_token' => $user->api_token ?: $user->createToken('access_token')->plainTextToken,
        ]);

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return redirect()->intended('dashboard');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        $request->user()->update([
            'venue_id' => null,
            'api_token' => null,
        ]);

        //$request->user()->tokens()->delete();

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->intended('/');
    }

    public function web_password_login(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $user = $request->user();

        $user->update([
            'venue_id' => null,
            'api_token' => $user->api_token ?: $user->createToken('access_token')->plainTextToken,
        ]);

        $request->session()->regenerate();
        return new JsonResponse();
    }

    public function mobile_password_login(LoginRequest $request): LoginResource
    {
        $request->authenticate();
        $user = $request->user();
        return new LoginResource($user);
    }

    public function mobile_password_logout(Request $request): JsonResponse
    {
        $user = $request->user();
        //$user->tokens()->delete();

        return new JsonResponse(['message' => 'you are logged out']);
    }

}
