<?php

it('serves the landing page', function () {
    $this->get('/')
        ->assertOk()
        ->assertSee('Bannr', false)
        ->assertSee('ASCII art', false)
        ->assertSee(route('app'), false);
});

it('serves the app page with the editor, formats and the 7-bit guard', function () {
    $this->get('/app')
        ->assertOk()
        ->assertSee('Fichier cible', false)
        ->assertSee('Forcer 7 bits', false)
        ->assertSee('7 bits', false)
        ->assertSee('Copier', false)
        ->assertSee('Télécharger', false)
        ->assertSee('100% local', false);
});

it('hides an ascii signature in its own robots.txt', function () {
    $lines = file(public_path('robots.txt'), FILE_IGNORE_NEW_LINES);

    expect($lines)->toContain('User-agent: *');

    foreach ($lines as $line) {
        expect($line === '' || str_starts_with($line, '#') || str_contains($line, ':'))->toBeTrue($line);
        expect(mb_check_encoding($line, 'ASCII'))->toBeTrue();
    }
});
