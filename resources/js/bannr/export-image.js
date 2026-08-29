export const IMAGE_THEMES = [
    { id: 'terminal', label: 'Terminal' },
    { id: 'transparent', label: 'Transparent' },
    { id: 'light', label: 'Clair' },
];

const CHAR_RATIO = 0.6;

function escapeXml(text) {
    return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function palette({ theme, bg, fg, ink }) {
    if (theme === 'light') return { bg: ink, fg: bg };
    if (theme === 'transparent') return { bg: null, fg };
    return { bg, fg };
}

export function measure(text, { fontSize = 16, padding = 24, lineHeight = 1.2 } = {}) {
    const lines = text.replace(/\r\n?/g, '\n').split('\n');
    const cols = lines.reduce((max, line) => Math.max(max, line.length), 0);
    const charWidth = fontSize * CHAR_RATIO;
    return {
        lines,
        charWidth,
        lineHeight: fontSize * lineHeight,
        width: Math.ceil(cols * charWidth + padding * 2),
        height: Math.ceil(lines.length * fontSize * lineHeight + padding * 2),
    };
}

/** Vector export: one <text> per line, whitespace preserved, no external deps. */
export function artToSvg(text, options = {}) {
    const { fontSize = 16, padding = 24, fontFamily = 'JetBrains Mono, Menlo, Consolas, monospace' } = options;
    const { lines, lineHeight, width, height } = measure(text, { fontSize, padding });
    const colors = palette(options);
    const rect = colors.bg ? `  <rect width="100%" height="100%" rx="12" fill="${colors.bg}"/>\n` : '';
    const body = lines
        .map((line, i) => `  <text x="${padding}" y="${(padding + lineHeight * i + fontSize * 0.85).toFixed(1)}" xml:space="preserve">${escapeXml(line)}</text>`)
        .join('\n');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="${escapeXml(fontFamily)}" font-size="${fontSize}" fill="${colors.fg}">\n${rect}${body}\n</svg>\n`;
}

/** Raster export drawn on a canvas at 2x for crisp text. */
export async function artToPngBlob(text, options = {}) {
    const { fontSize = 16, padding = 24, fontFamily = 'JetBrains Mono, Menlo, Consolas, monospace', scale = 2 } = options;
    const font = `${fontSize}px ${fontFamily}`;
    if (document.fonts?.load) await document.fonts.load(font).catch(() => {});

    const probe = document.createElement('canvas').getContext('2d');
    probe.font = font;
    const charWidth = probe.measureText('M').width || fontSize * CHAR_RATIO;
    const { lines, lineHeight } = measure(text, { fontSize, padding });
    const cols = lines.reduce((max, line) => Math.max(max, line.length), 0);
    const width = Math.ceil(cols * charWidth + padding * 2);
    const height = Math.ceil(lines.length * lineHeight + padding * 2);

    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    const colors = palette(options);
    if (colors.bg) {
        ctx.fillStyle = colors.bg;
        ctx.beginPath();
        ctx.roundRect(0, 0, width, height, 12);
        ctx.fill();
    }
    ctx.font = font;
    ctx.fillStyle = colors.fg;
    ctx.textBaseline = 'alphabetic';
    lines.forEach((line, i) => ctx.fillText(line, padding, padding + lineHeight * i + fontSize * 0.85));

    return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob'))), 'image/png'));
}
