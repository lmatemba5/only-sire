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
    $queues = DB::table('jobs')->where('queue', 'like', 'queue-worker-%')->select(['queue as name', DB::raw('COUNT(*) as jobs')])->groupBy('name')->orderBy('jobs')->get();

    $queues_count = $queues->count();

    if($queues_count == 10){
        return $queues->first()->name;
    }
    
    $queues = $queues->pluck('name')->all();

    for ($key=1; $key<=10; $key++) {
       $queue = "queue-worker-{$key}";

       if(!in_array($queue, $queues)){
            return $queue;
       }
    }

    return 'default';
}