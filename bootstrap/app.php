<?php

use App\Http\Middleware\AllowOnlyActiveAccount;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->alias([
           'active' => AllowOnlyActiveAccount::class
        ]);

        $middleware->web(append: [
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,

        ]);
    })->withExceptions(function (Exceptions $exceptions) {
    })->withSchedule(function(Schedule $schedule){
        for($i=0; $i<=1; $i++){
            $command = "queue:work --queue=";
    
            if($i== 0){
                $command .= "default";
            }else{
                $command .= "queue-worker-$i";
            }
    
            $schedule->command("$command --sleep=3 --tries=3 --stop-when-empty")->withoutOverlapping()->runInBackground()->everyTenSeconds();
        }
    })->create();
