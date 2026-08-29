import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import figlet from 'figlet';
import { FONTS } from '../../resources/js/bannr/fonts.js';
import { isAscii } from '../../resources/js/bannr/ascii.js';

test('curated fonts are flagged correctly and all bundled', () => {
    const sample = 'Bannr 0123456789 !?.,:;-_/()[]{}<>@#$%&*+=~ ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz';
    for (const font of FONTS) {
        assert.ok(fs.existsSync(`node_modules/figlet/importable-fonts/${font.id}.js`), font.id);
        const out = figlet.textSync(sample, { font: font.id });
        assert.equal(isAscii(out), font.ascii, `${font.id} ascii flag`);
    }
});

test('font loader map covers exactly the curated set', () => {
    const source = fs.readFileSync('resources/js/bannr/font-loader.js', 'utf8');
    for (const font of FONTS) assert.ok(source.includes(`'${font.id}': () => import(`), font.id);
    assert.equal((source.match(/=> import\(/g) ?? []).length, FONTS.length);
});
