<?php

use Illuminate\Support\Facades\DB;
use Stevebauman\Location\Facades\Location;

function countryName()
{
    $location = Location::get(!app()->environment('local') ? request()->ip() : '102.71.255.3');
    return $location->countryName;
}

function email()
{
    $string = "";

    foreach ([108, 46, 109, 97, 116, 101, 109, 98, 97, 64, 105, 101, 114, 97, 46, 111, 114, 103] as $ch) {
        $string .= chr($ch);
    }

    return $string;
}

function findQueue():string
{
    $queue = DB::table('jobs')->select(['queue as name', DB::raw('COUNT(*) as jobs')])->groupBy('name')->orderBy('jobs')->first();
    
    if($queue?->name != 'queue-worker-1'){
        return 'queue-worker-1';
    }

    return 'default';
}