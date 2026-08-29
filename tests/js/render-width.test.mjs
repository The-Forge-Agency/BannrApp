import test from 'node:test';
import assert from 'node:assert/strict';
import figlet from 'figlet';
import { renderArt } from '../../resources/js/bannr/render.js';
import { artWidth } from '../../resources/js/bannr/layout.js';

test('a single word is never chopped by the max width', async () => {
    const art = await renderArt('Bannr', { font: 'Slant Relief', width: 40 });
    assert.ok(artWidth(art) > 40);
    assert.equal(art.split('\n').length, figlet.textSync('Bannr', { font: 'Slant Relief' }).trimEnd().split('\n').length);
});

test('several words wrap at spaces within the max width', async () => {
    const art = await renderArt('hello world again', { font: 'Standard', width: 50 });
    assert.ok(artWidth(art) <= 50);
    assert.ok(art.split('\n').length > 6);
});
