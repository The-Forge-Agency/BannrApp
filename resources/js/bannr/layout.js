export const ALIGNMENTS = ['left', 'center', 'right'];
export const FRAMES = ['none', 'box', 'double', 'hash', 'stars'];

const FRAME_CHARS = {
    box: { tl: '+', tr: '+', bl: '+', br: '+', h: '-', v: '|' },
    double: { tl: '#', tr: '#', bl: '#', br: '#', h: '=', v: '#' },
    hash: { tl: '#', tr: '#', bl: '#', br: '#', h: '#', v: '#' },
    stars: { tl: '*', tr: '*', bl: '*', br: '*', h: '*', v: '*' },
};

export function toLines(text) {
    return text.replace(/\r\n?/g, '\n').split('\n');
}

export function trimArt(text) {
    const lines = toLines(text).map((line) => line.replace(/\s+$/, ''));
    while (lines.length && lines[0] === '') lines.shift();
    while (lines.length && lines[lines.length - 1] === '') lines.pop();
    return lines.join('\n');
}

export function artWidth(text) {
    return toLines(text).reduce((max, line) => Math.max(max, line.length), 0);
}

export function alignArt(text, alignment) {
    if (alignment === 'left' || !text) return text;
    const width = artWidth(text);
    return toLines(text)
        .map((line) => {
            const gap = width - line.length;
            if (alignment === 'right') return ' '.repeat(gap) + line;
            return ' '.repeat(Math.floor(gap / 2)) + line;
        })
        .join('\n');
}

export function frameArt(text, style, padding = 1) {
    const chars = FRAME_CHARS[style];
    if (!chars || !text) return text;
    const width = artWidth(text);
    const inner = width + padding * 2;
    const pad = ' '.repeat(padding);
    const top = chars.tl + chars.h.repeat(inner) + chars.tr;
    const bottom = chars.bl + chars.h.repeat(inner) + chars.br;
    const body = toLines(text).map((line) => chars.v + pad + line.padEnd(width) + pad + chars.v);
    return [top, ...body, bottom].join('\n');
}

/** Assembles free lines, art and free lines into the final block. */
export function composeBlock({ art, before = '', after = '' }) {
    const parts = [];
    const head = trimArt(before);
    const tail = trimArt(after);
    if (head) parts.push(head);
    if (art) parts.push(art);
    if (tail) parts.push(tail);
    return parts.join('\n');
}
