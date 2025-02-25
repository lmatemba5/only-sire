<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SystemController extends Controller
{
    public function index(Request $request)
    {
        switch ($request->user()->roles()->first()->name) {
            case 'Country Admin':
                return $this->render_country_admin_dashboard();
            default:
                return $this->render_interviewer_dashboard();
        }
    }

    public function render_country_admin_dashboard()
    {
        return view('pages.country-admin.index', [
            'data' => [
                'activeTab' => 'dashboard',
                ...$this->data(),
            ],
        ]);
    }

    public function render_interviewer_dashboard()
    {
        return view('pages.interviewer.index', [
            'data' => [
                'activeTab' => 'dashboard',
                ...$this->data(),
            ],
        ]);
    }

    public function render_account_locked(Request $request)
    {
        $user = $request->user();

        if(!$user || $user->isLocked == 0){
            if(url()->previous()){
                return back();
            }

            return redirect('/');
        }

        return view('pages.locked-account', [
            'data' => [
                'csrf_token' => csrf_token()
            ],
        ]);
    }
}
