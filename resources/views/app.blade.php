<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="twitter:site" content="@justcliptv">
        {!! Meta::tag('twitter:card', 'summary') !!}
        <meta property="og:site_name" content="Justclip">
        {!! Meta::tag('og:title', 'Justclip') !!}
        {!! Meta::tag('og:description', "Justclip is a network of communities based on clipper's shared memorable moments from their favourite Twitch streams and videos. Find broadcasters you're interested in, and become part of an online community!") !!}
        {!! Meta::tag('og:image', asset('/images/logo_icon.png')) !!}
        {!! Meta::tag('og:url', Request::url()); !!}
        <meta property="og:type" content="website">
        <meta name="title" content="Justclip">
        <meta name="description" content="Justclip is a network of communities based on clipper's shared memorable moments from their favourite Twitch streams and videos. Find broadcasters you're interested in, and become part of an online community!">
        <meta name="msapplication-TileColor" content="#4d8844">
        <meta name="theme-color" content="#ffffff">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('/apple-touch-icon.png') }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('/favicon-32x32.png') }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('/favicon-16x16.png') }}">
        <link rel="mask-icon" href="{{ asset('/safari-pinned-tab.svg') }}" color="#5bbad5">
        @routes
        @if (app()->environment('local'))
            <link href="{{ mix('/css/app.css') }}" rel="stylesheet">
            <script src="{{ mix('/js/app.js') }}" defer></script>
        @else
            <link href="{{ asset('/css/app.css') }}" rel="stylesheet">
            <script src="{{ asset('/js/app.js') }}" defer></script>
        @endif
        <script async src="https://kit.fontawesome.com/28596637d2.js" crossorigin="anonymous"></script>
        {{-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2478457205374361" crossorigin="anonymous"></script> --}}
    </head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-162613808-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-162613808-1');
    </script>
    <body class="bg-dark text-white bg-no-repeat">
        @inertia
    </body>
</html>
