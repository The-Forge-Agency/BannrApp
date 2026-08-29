import figlet from 'figlet';
import { loadFont } from './font-loader.js';
import { alignArt, artWidth, composeBlock, frameArt, trimArt } from './layout.js';
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
    const options = { font, horizontalLayout: layout, verticalLayout: 'default', whitespaceBreak: true };
    // Max width only breaks between words: a single word is never chopped
    // mid-glyph, it simply overflows and scrolls.
    const unbroken = trimArt(figlet.textSync(text, { ...options, width: 10000 }));
    if (!/\s/.test(text.trim()) || artWidth(unbroken) <= width) return unbroken;
    return trimArt(figlet.textSync(text, { ...options, width: Math.max(20, width) }));
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
