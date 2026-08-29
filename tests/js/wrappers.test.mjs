import test from 'node:test';
import assert from 'node:assert/strict';
import { wrap, FORMATS } from '../../resources/js/bannr/wrappers.js';

const ART = [
    '  ____   ',
    ' | __ )  ',
    ' |  _ \\  ',
    ' | |_) | ',
    ' |____/  ',
].join('\n');

test('every format ends with a newline', () => {
    for (const format of FORMATS) {
        assert.ok(wrap(ART, format.id).endsWith('\n'), format.id);
    }
});

test('robots.txt prefixes every line with # and keeps directives parseable', () => {
    const out = wrap(ART + '\n\nUser-agent: *', 'robots');
    const lines = out.trimEnd().split('\n');
    assert.ok(lines.every((line) => line.startsWith('#')));
    assert.equal(lines.find((line) => line.trim() === '#'), '#');
});

test('js block escapes a closing sequence inside the art', () => {
    const out = wrap('a */ b\n c', 'js-block');
    assert.equal(out.indexOf('*/'), out.lastIndexOf('*/'));
    assert.ok(out.includes('*\\/'));
    assert.ok(out.startsWith('/*\n'));
    assert.ok(out.endsWith('\n*/\n'));
});

test('js line format is a valid module', () => {
    const out = wrap(ART, 'js-line');
    assert.ok(out.split('\n').filter(Boolean).every((line) => line.startsWith('//')));
    assert.doesNotThrow(() => new Function(out));
});

test('js block output is valid javascript even with */ in art', () => {
    const out = wrap('x */ y\n*/', 'js-block');
    assert.doesNotThrow(() => new Function(out + 'const ok = 1;'));
});

test('markdown picks a fence longer than any backtick run', () => {
    const out = wrap('has ``` inside', 'markdown');
    assert.ok(out.startsWith('````\n'));
    assert.ok(out.endsWith('\n````\n'));
});

test('html comment never contains a closing sequence before the end', () => {
    const out = wrap('a --> b\n<!-- c', 'html');
    assert.equal(out.indexOf('-->'), out.length - 4);
    assert.equal(out.indexOf('<!--'), 0);
    assert.equal(out.lastIndexOf('<!--'), 0);
});

test('custom line mode applies prefix and suffix', () => {
    const out = wrap('ab\ncd', 'custom', { mode: 'line', prefix: '-- ', suffix: ' --' });
    assert.equal(out, '-- ab --\n-- cd --\n');
});

test('custom block mode uses open and close', () => {
    const out = wrap('ab', 'custom', { mode: 'block', open: '<#', close: '#>', indent: '' });
    assert.equal(out, '<#\nab\n#>\n');
});

test('python and shell use hash lines', () => {
    assert.equal(wrap('x', 'python'), '# x\n');
    assert.equal(wrap('x', 'shell'), '# x\n');
});
