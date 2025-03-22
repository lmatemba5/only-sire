<?php

use App\Http\Controllers\API\InterviewController;
use Illuminate\Support\Facades\Route;

Route::controller(InterviewController::class)->group(function(){
    Route::get('interviews', 'create');
});