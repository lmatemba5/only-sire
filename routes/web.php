<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SystemController;

Route::get('/', function () {
    return view('pages.welcome')->with([
        "user" => request()->user()
    ]);
});

Route::middleware(['auth', 'verified', 'active'])->group(function () {
    require __DIR__.'/web/interviews.php';
    require __DIR__.'/web/country-admin.php';

    Route::get('dashboard', [SystemController::class, 'index'])->name('dashboard');
});

Route::get('account-locked', [SystemController::class, 'render_account_locked']);
require __DIR__.'/auth.php';

