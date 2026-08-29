import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_STATE, encodeState, hashToState, stateToHash } from '../../resources/js/bannr/share.js';

test('state survives a round trip through the fragment', () => {
    const state = { ...DEFAULT_STATE, text: 'Bannr é ✓', font: 'Doom', format: 'html', frame: 'box', before: 'v1.0', custom: { ...DEFAULT_STATE.custom, prefix: ';; ' } };
    const hash = stateToHash(state);
    assert.ok(hash.startsWith('#s='));
    assert.ok(/^#s=[A-Za-z0-9_-]+$/.test(hash));
    assert.deepEqual(hashToState(hash).state, state);
});

test('defaults are omitted from the fragment', () => {
    assert.equal(encodeState({ ...DEFAULT_STATE }), encodeState({}));
});

test('a cropped link falls back to a clean empty state', () => {
    const hash = stateToHash({ ...DEFAULT_STATE, text: 'a'.repeat(120) });
    const result = hashToState(hash.slice(0, 20));
    assert.equal(result.truncated, true);
    assert.equal(result.state.text, '');
});

test('unknown hashes are ignored', () => {
    assert.equal(hashToState('#envoyer'), null);
    assert.equal(hashToState(''), null);
});
