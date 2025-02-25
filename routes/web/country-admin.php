<?php

use App\Http\Controllers\API\VenueController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;

Route::controller(VenueController::class)->group(function(){
    Route::get('venues', 'create');
});

Route::controller(UserController::class)->group(function(){
    Route::get('users', 'create');
});