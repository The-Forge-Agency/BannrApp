import { DEFAULT_FONT } from './fonts.js';

export const MAX_HASH_LENGTH = 6000;
export const MAX_TEXT_LENGTH = 200;

export const DEFAULT_STATE = Object.freeze({
    text: '',
    font: DEFAULT_FONT,
    format: 'robots',
    layout: 'default',
    width: 80,
    align: 'left',
    frame: 'none',
    before: '',
    after: '',
    force: false,
    forceMode: 'translit',
    asciiOnly: false,
    custom: { mode: 'line', prefix: '# ', suffix: '', open: '/*', close: '*/', indent: '' },
});

// Short keys keep the fragment compact; nothing here ever hits the server.
const KEYS = {
    text: 't', font: 'f', format: 'o', layout: 'l', width: 'w', align: 'a', frame: 'r',
    before: 'b', after: 'e', force: 'x', forceMode: 'm', asciiOnly: 's', custom: 'c',
};

function toBase64Url(bytes) {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text) {
    const padded = text.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (text.length % 4)) % 4);
    const binary = atob(padded);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function encodeState(state) {
    const compact = {};
    for (const [key, short] of Object.entries(KEYS)) {
        const value = state[key];
        if (value === undefined || JSON.stringify(value) === JSON.stringify(DEFAULT_STATE[key])) continue;
        compact[short] = value;
    }
    const json = JSON.stringify(compact);
    return toBase64Url(new TextEncoder().encode(json));
}

/** @returns {{state: object, truncated: boolean} | null} */
export function decodeState(encoded) {
    if (!encoded) return null;
    try {
        const json = new TextDecoder().decode(fromBase64Url(encoded));
        const compact = JSON.parse(json);
        const state = { ...DEFAULT_STATE, custom: { ...DEFAULT_STATE.custom } };
        for (const [key, short] of Object.entries(KEYS)) {
            if (compact[short] === undefined) continue;
            if (key === 'custom') state.custom = { ...state.custom, ...compact[short] };
            else state[key] = compact[short];
        }
        if (typeof state.text !== 'string') state.text = '';
        state.text = state.text.slice(0, MAX_TEXT_LENGTH);
        state.width = Math.min(Math.max(Number(state.width) || 80, 20), 300);
        return { state, truncated: false };
    } catch {
        // A cropped link (messaging apps love to cut long URLs) is still
        // worth a fresh, empty editor rather than a crash.
        return { state: { ...DEFAULT_STATE, custom: { ...DEFAULT_STATE.custom } }, truncated: true };
    }
}

export function stateToHash(state) {
    const encoded = encodeState(state);
    return encoded.length > MAX_HASH_LENGTH ? null : '#s=' + encoded;
}

export function hashToState(hash) {
    const match = /^#s=([A-Za-z0-9_-]+)/.exec(hash ?? '');
    return match ? decodeState(match[1]) : null;
}
