@extends('layouts.app', ['title' => 'Homa'])

@section('content')
    <div id="root"></div>
    @vite('resources/js/pages/welcome.jsx')
@endSection