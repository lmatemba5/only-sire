@extends('layouts.app', ['title' => 'Dashboard'])

@section('content')
    <div id="index-widget" data="{{json_encode($data)}}"></div>
    @vite('resources/js/pages/country-admin/index.jsx')
@endSection