@extends('layouts.app', ['title' => 'Home'])

@section('content')
<div id="root" data="{{json_encode($user)}}"></div>
@vite('resources/js/pages/welcome.jsx')
@endSection

<script>
    document.querySelectorAll('.testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('transform', 'transition', 'duration-300', 'ease-in-out');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('transform', 'transition', 'duration-300', 'ease-in-out');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
</script>