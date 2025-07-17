<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link rel="icon" href="/images/logo.png" type="image/png"/>
       <title>{{$title}}</title>
        <!-- Scripts -->
        @viteReactRefresh
        @vite('resources/css/app.css')
    </head>
    <body class="font-sans antialiased text-gray-800">
        @yield('content')
    </body>
</html>
