@extends('layouts.app', ['title' => 'Venues'])

@section('content')
    <div id="index-widget" data="{{json_encode($data)}}"></div>
    @vite('resources/js/pages/country-admin/venues/index.jsx')
@endSection