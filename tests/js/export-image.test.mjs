import test from 'node:test';
import assert from 'node:assert/strict';
import { artToSvg, measure } from '../../resources/js/bannr/export-image.js';

test('svg has one text node per line and escapes markup', () => {
    const svg = artToSvg('<a>\n & b', { theme: 'terminal', bg: '#000', fg: '#0f0', fontSize: 16, padding: 10 });
    assert.equal((svg.match(/<text /g) ?? []).length, 2);
    assert.ok(svg.includes('&lt;a&gt;'));
    assert.ok(svg.includes(' &amp; b'));
    assert.ok(svg.includes('xml:space="preserve"'));
    assert.ok(svg.includes('<rect'));
});

test('transparent theme draws no background', () => {
    assert.ok(!artToSvg('x', { theme: 'transparent', fg: '#0f0' }).includes('<rect'));
});

test('dimensions follow the widest line', () => {
    const { width, height } = measure('abcd\nab', { fontSize: 10, padding: 5 });
    assert.equal(width, Math.ceil(4 * 6 + 10));
    assert.equal(height, Math.ceil(2 * 12 + 10));
});

test('font-family with quotes stays a valid attribute', () => {
    const svg = artToSvg('x', { theme: 'terminal', bg: '#000', fg: '#0f0', fontFamily: '"JetBrains Mono", monospace' });
    assert.ok(svg.includes('font-family="&quot;JetBrains Mono&quot;, monospace"'));
});
