import test from 'node:test';
import assert from 'node:assert/strict';
import { findNonAscii, forceAscii, isAscii } from '../../resources/js/bannr/ascii.js';

test('detects and counts non-ascii glyphs', () => {
    const found = findNonAscii('██╗ ██║ é');
    assert.equal(isAscii('██╗'), false);
    assert.equal(found[0].char, '█');
    assert.equal(found[0].count, 4);
    assert.ok(found.some((entry) => entry.code === 'U+00E9'));
});

test('translit keeps width and yields pure 7-bit', () => {
    const input = '██╗  ╚═╝ ▄▀ é';
    const out = forceAscii(input, 'translit');
    assert.equal(out.length, input.length);
    assert.ok(isAscii(out));
    assert.equal(out, '##+  +=+ _^ ?');
});

test('strip replaces with spaces', () => {
    assert.equal(forceAscii('a█b', 'strip'), 'a b');
});
