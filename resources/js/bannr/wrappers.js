import { toLines } from './layout.js';

/**
 * Every format returns a file that stays valid once pasted. Line formats
 * prefix each line; block formats escape the closing sequence so the art
 * can never terminate the comment early.
 */
export const FORMATS = [
    { id: 'plain', label: 'Texte brut', short: 'txt', filename: 'banner.txt', mime: 'text/plain', kind: 'plain' },
    { id: 'markdown', label: 'README.md', short: 'md', filename: 'README.md', mime: 'text/markdown', kind: 'fence' },
    { id: 'robots', label: 'robots.txt', short: 'robots', filename: 'robots.txt', mime: 'text/plain', kind: 'line', prefix: '# ' },
    { id: 'js-block', label: 'JavaScript /* */', short: 'js', filename: 'banner.js', mime: 'text/javascript', kind: 'block', open: '/*', close: '*/', indent: ' * ' },
    { id: 'js-line', label: 'JavaScript //', short: 'js //', filename: 'banner.js', mime: 'text/javascript', kind: 'line', prefix: '// ' },
    { id: 'html', label: 'HTML', short: 'html', filename: 'header.html', mime: 'text/html', kind: 'html' },
    { id: 'python', label: 'Python', short: 'py', filename: 'banner.py', mime: 'text/x-python', kind: 'line', prefix: '# ' },
    { id: 'shell', label: 'Shell', short: 'sh', filename: 'banner.sh', mime: 'text/x-shellscript', kind: 'line', prefix: '# ' },
    { id: 'css', label: 'CSS', short: 'css', filename: 'banner.css', mime: 'text/css', kind: 'block', open: '/*', close: '*/', indent: ' * ' },
    { id: 'jsonc', label: 'JSONC', short: 'jsonc', filename: 'banner.jsonc', mime: 'application/json', kind: 'block', open: '/*', close: '*/', indent: ' * ' },
    { id: 'custom', label: 'Personnalisé', short: 'custom', filename: 'banner.txt', mime: 'text/plain', kind: 'custom' },
];

export function findFormat(id) {
    return FORMATS.find((format) => format.id === id) ?? FORMATS[0];
}

function wrapLines(text, prefix) {
    return toLines(text)
        .map((line) => (line === '' ? prefix.trimEnd() : prefix + line))
        .join('\n');
}

function escapeBlockClose(text, close) {
    if (!close) return text;
    // "*/" becomes "*\/" — same width, and never closes the comment.
    if (close === '*/') return text.replaceAll('*/', '*\\/');
    return text.split(close).join(close.slice(0, -1) + ' ' + close.slice(-1));
}

function wrapBlock(text, { open, close, indent = '' }) {
    const safe = escapeBlockClose(text, close);
    const body = toLines(safe).map((line) => (line === '' ? indent.trimEnd() : indent + line));
    return [open, ...body, close].join('\n');
}

function wrapHtml(text) {
    // HTML5 forbids "<!--", "-->" and "--!>" inside a comment, and a comment
    // may not start with ">" or "->". Everything else (bare "--") is fine.
    const safe = text
        .replaceAll('<!--', '<!- -')
        .replaceAll('-->', '- ->')
        .replaceAll('--!>', '- -!>');
    const body = toLines(safe).map((line) => '    ' + line);
    return ['<!--', ...body, '-->'].join('\n');
}

function wrapFence(text) {
    // Pick a backtick run longer than any run present in the art.
    let longest = 0;
    for (const match of text.matchAll(/`+/g)) longest = Math.max(longest, match[0].length);
    const fence = '`'.repeat(Math.max(3, longest + 1));
    return [fence, text, fence].join('\n');
}

function wrapCustom(text, custom = {}) {
    const mode = custom.mode ?? 'line';
    if (mode === 'block') {
        return wrapBlock(text, { open: custom.open ?? '/*', close: custom.close ?? '*/', indent: custom.indent ?? '' });
    }
    const prefix = custom.prefix ?? '# ';
    const suffix = custom.suffix ?? '';
    return toLines(text)
        .map((line) => (line === '' && !suffix ? prefix.trimEnd() : prefix + line + suffix))
        .join('\n');
}

/**
 * @param {string} text  The composed block (free lines + art).
 * @param {string} formatId
 * @param {object} custom  Settings for the custom format.
 * @returns {string} Ready-to-paste file content, always newline-terminated.
 */
export function wrap(text, formatId, custom = {}) {
    const format = findFormat(formatId);
    let out;
    switch (format.kind) {
        case 'line': out = wrapLines(text, format.prefix); break;
        case 'block': out = wrapBlock(text, format); break;
        case 'html': out = wrapHtml(text); break;
        case 'fence': out = wrapFence(text); break;
        case 'custom': out = wrapCustom(text, custom); break;
        default: out = text;
    }
    return out.endsWith('\n') ? out : out + '\n';
}
