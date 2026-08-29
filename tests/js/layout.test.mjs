import test from 'node:test';
import assert from 'node:assert/strict';
import { alignArt, artWidth, composeBlock, frameArt, trimArt } from '../../resources/js/bannr/layout.js';

test('trimArt removes trailing spaces and blank edges', () => {
    assert.equal(trimArt('\n ab  \ncd \n\n'), ' ab\ncd');
});

test('alignArt pads center and right', () => {
    assert.equal(alignArt('abcd\nab', 'right'), 'abcd\n  ab');
    assert.equal(alignArt('abcd\nab', 'center'), 'abcd\n ab');
    assert.equal(alignArt('abcd\nab', 'left'), 'abcd\nab');
});

test('frameArt draws a rectangular box', () => {
    const out = frameArt('abcd\nab', 'box');
    const lines = out.split('\n');
    assert.equal(lines[0], '+------+');
    assert.equal(lines[1], '| abcd |');
    assert.equal(lines[2], '| ab   |');
    assert.equal(lines[3], '+------+');
    assert.equal(artWidth(out), 8);
});

test('composeBlock joins free lines around the art', () => {
    assert.equal(composeBlock({ art: 'X', before: 'top', after: 'bottom\n' }), 'top\nX\nbottom');
    assert.equal(composeBlock({ art: 'X' }), 'X');
});
