@component('mail::message')
# Hi, {{$user->name}}

Your <a href="{{url('/')}}">{{config('app.name')}}</a> account is ready.

Below are the default login details.

<strong>You are strongly advised to change once you log in</strong>

@component('mail::panel')
    @component('mail::table')
    |Credentials    |                     |
    |:------------- |:--------------------|
    |Email    |{{$user->email}}     |
    |Password       | {{$password}}    |
    @endcomponent
@endcomponent

@component('mail::button', ['url' => config('app.url')."/login"])
Login
@endcomponent

Thanks,<br>
{{config('app.name')}}
@endcomponent