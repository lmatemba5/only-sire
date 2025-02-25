<?php

use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\API\LoginController;

Route::middleware('guest')->group(function () {

    Route::get('google_login', function () {
        return Socialite::driver('google')->with(["prompt" => "select_account"])->redirect();
    });

    Route::get('auth/callback', [LoginController::class, 'google_login']);

    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'web_password_login']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');
});

