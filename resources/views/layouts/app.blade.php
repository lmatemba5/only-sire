<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="/images/logo.png" type="image/png"/>
       <title>{{$title}}</title>
        <!-- Scripts -->
        @viteReactRefresh
        @vite('resources/css/app.css')
    </head>
    <body class="font-sans antialiased">
        @yield('content')
    </body>
</html>
