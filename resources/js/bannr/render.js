import figlet from 'figlet';
import { loadFont } from './font-loader.js';
import { alignArt, composeBlock, frameArt, trimArt } from './layout.js';
import { findNonAscii, forceAscii } from './ascii.js';
import { wrap } from './wrappers.js';

export const LAYOUTS = [
    { id: 'default', label: 'Ajusté' },
    { id: 'fitted', label: 'Serré' },
    { id: 'full', label: 'Pleine largeur' },
];

export async function renderArt(text, { font, layout = 'default', width = 80 }) {
    await loadFont(figlet, font);
    if (!text.trim()) return '';
    const raw = figlet.textSync(text, {
        font,
        horizontalLayout: layout,
        verticalLayout: 'default',
        width: Math.max(20, width),
        whitespaceBreak: true,
    });
    return trimArt(raw);
}

/** Full pipeline: art → 7-bit guard → align/frame → free lines → wrapper. */
export async function renderFile(state) {
    let art = await renderArt(state.text, state);
    const nonAscii = findNonAscii(art);
    if (state.force && nonAscii.length) art = forceAscii(art, state.forceMode);

    art = frameArt(alignArt(art, state.align), state.frame);
    const block = composeBlock({ art, before: state.before, after: state.after });
    const file = wrap(block, state.format, state.custom);

    return { art, block, file, nonAscii, forced: state.force && nonAscii.length > 0 };
}
