@extends('layouts.app', ['title' => 'Users'])

@section('content')
    <div id="officers-widget" data="{{json_encode($data)}}"></div>
    @vite('resources/js/pages/country-admin/officers.jsx')
@endSection