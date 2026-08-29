<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

    <title>@yield('title', 'Bannr — Ton texte en ASCII art, prêt à coller dans ton code')</title>
    <meta name="description" content="@yield('description', 'Bannr transforme un texte en ASCII art (figlet) et l\'exporte déjà enrobé dans la bonne syntaxe de commentaire : README, JavaScript, robots.txt, HTML. 100% côté navigateur, ASCII 7 bits garanti, zéro compte, open source.')">

    <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml">
    <link rel="icon" href="{{ asset('favicon-32.png') }}" type="image/png" sizes="32x32">
    <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">
    <meta name="theme-color" content="#0C0D0E">

    <meta property="og:title" content="@yield('og_title', 'Bannr')">
    <meta property="og:description" content="Ton texte en ASCII art, prêt à coller dans ton code. 100% local, ASCII 7 bits garanti.">
    <meta property="og:type" content="website">

    @fonts
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('head')
</head>
<body class="min-h-screen antialiased" data-page="@yield('page')">
@yield('body')
</body>
</html>
