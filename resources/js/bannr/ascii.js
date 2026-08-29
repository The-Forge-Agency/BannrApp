// Width-preserving transliteration of the glyphs figlet fonts commonly
// use above 0x7F, so forced output keeps its shape.
const TRANSLIT = {
    '█': '#', '▓': '#', '▒': '+', '░': '.',
    '▀': '^', '▄': '_', '▐': '|', '▌': '|', '■': '#', '□': '#',
    '═': '=', '║': '|', '─': '-', '│': '|', '━': '-', '┃': '|',
    '╔': '+', '╗': '+', '╚': '+', '╝': '+', '╠': '+', '╣': '+', '╦': '+', '╩': '+', '╬': '+',
    '┌': '+', '┐': '+', '└': '+', '┘': '+', '├': '+', '┤': '+', '┬': '+', '┴': '+', '┼': '+',
    '┏': '+', '┓': '+', '┗': '+', '┛': '+', '┣': '+', '┫': '+', '┳': '+', '┻': '+', '╋': '+',
    '╭': '+', '╮': '+', '╰': '+', '╯': '+', '╻': '|', '╹': '|', '╸': '-', '╺': '-',
    '•': '*', '·': '.', '▪': '*', '▫': '.', '◆': '*', '◇': '*', '●': '*', '○': 'o',
    '…': '.', '–': '-', '—': '-', '‘': "'", '’': "'", '“': '"', '”': '"', '×': 'x', '÷': '/',
    ' ': ' ',
};

export function isAscii(text) {
    for (let i = 0; i < text.length; i++) {
        if (text.charCodeAt(i) > 127) return false;
    }
    return true;
}

/** @returns {Array<{char: string, code: string, count: number}>} */
export function findNonAscii(text) {
    const seen = new Map();
    for (const char of text) {
        const code = char.codePointAt(0);
        if (code <= 127) continue;
        const entry = seen.get(char) ?? { char, code: 'U+' + code.toString(16).toUpperCase().padStart(4, '0'), count: 0 };
        entry.count++;
        seen.set(char, entry);
    }
    return [...seen.values()].sort((a, b) => b.count - a.count);
}

/**
 * mode 'translit' swaps known glyphs for a same-width ASCII stand-in and
 * falls back to '?'. mode 'strip' replaces every offending char with a space.
 */
export function forceAscii(text, mode = 'translit') {
    let out = '';
    for (const char of text) {
        if (char.codePointAt(0) <= 127) {
            out += char;
        } else if (mode === 'strip') {
            out += ' ';
        } else {
            out += TRANSLIT[char] ?? '?';
        }
    }
    return out;
}
