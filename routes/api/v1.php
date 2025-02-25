<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\LoginController;
use App\Http\Controllers\API\TeamController;
use App\Http\Controllers\API\VenueController;
use App\Http\Controllers\API\InterviewController;
use Illuminate\Http\Request;

Route::post('login', [LoginController::class, 'mobile_password_login']);

Route::middleware(['auth:sanctum'])->group(function () {
    
    Route::apiResource('venues', VenueController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('teams', TeamController::class);

    Route::get('/user', function (Request $request) {
        return redirect('/api/v1/users/' . $request->user()->id);
    });
    
    Route::post('updateMyvenue', [InterviewController::class, 'updateMyVenue']);
    Route::post('generate_candidate_no', [InterviewController::class, 'generate_candidate_no']);
    Route::post('validate_candidate_no', [InterviewController::class, 'validate_candidate_no']);
    Route::post('create_new_candidate', [InterviewController::class, 'create_new_candidate']);

    Route::delete('destroy_temporary_candidate', [InterviewController::class, 'destroy_temporary_candidate']);
    Route::post('validate_candidate_data', [InterviewController::class, 'store']);
    Route::get('my_venues/{user_id}', [InterviewController::class, 'show']);
    
    Route::post('logout', [LoginController::class, 'mobile_password_logout']);
});
