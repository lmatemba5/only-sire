@extends('layouts.app', ['title' => 'Home | Modified'])

@section('content')
    <div id="root"></div>
    @vite('resources/js/pages/welcome.jsx')
@endSection