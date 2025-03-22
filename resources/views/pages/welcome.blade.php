@extends('layouts.app', ['title' => 'Home'])

@section('content')
    <div id="root"></div>
    @vite('resources/js/pages/welcome.jsx')
@endSection