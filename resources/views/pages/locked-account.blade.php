@extends('layouts.app', ['title' => 'Account | Locked'])

@section('content')
    <div id="account-locked-widget" data="{{json_encode($data)}}"></div>
    @vite('resources/js/pages/account-locked.jsx')
@endSection
