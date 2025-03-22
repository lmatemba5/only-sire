@extends('layouts.app', ['title' => 'Interviews'])

@section('content')
    <div id="index-widget" data="{{json_encode($data)}}"></div>
    @vite('resources/js/pages/interviewer/interviews.jsx')
@endSection