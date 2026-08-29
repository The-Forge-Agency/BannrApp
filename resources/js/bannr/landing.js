import figlet from 'figlet';
import { loadFont } from './font-loader.js';
import { trimArt } from './layout.js';
import { wrap } from './wrappers.js';

const DEMO_FONTS = ['Standard', 'Slant', 'Big', 'Doom', 'Small'];
const DEMO_FORMATS = ['robots', 'js-block', 'markdown', 'html'];

export function initLanding() {
    const input = document.getElementById('demo-input');
    const output = document.getElementById('demo-output');
    const fontButtons = [...document.querySelectorAll('[data-demo-font]')];
    const formatButtons = [...document.querySelectorAll('[data-demo-format]')];
    const fileName = document.getElementById('demo-filename');
    const tryLink = document.getElementById('demo-try');
    if (!input || !output) return;

    let font = DEMO_FONTS[0];
    let format = DEMO_FORMATS[0];
    let seq = 0;

    async function render() {
        const current = ++seq;
        const text = input.value.trim() || 'hello';
        await loadFont(figlet, font);
        if (current !== seq) return;
        const art = trimArt(figlet.textSync(text, { font, width: 60, whitespaceBreak: true }));
        output.textContent = wrap(art, format);
        const filenames = { robots: 'robots.txt', 'js-block': 'banner.js', markdown: 'README.md', html: 'header.html' };
        if (fileName) fileName.textContent = filenames[format];
        if (tryLink) {
            const params = { t: input.value.trim() || 'hello', f: font, o: format };
            const json = JSON.stringify(params);
            const bytes = new TextEncoder().encode(json);
            let binary = '';
            for (const byte of bytes) binary += String.fromCharCode(byte);
            tryLink.href = tryLink.dataset.base + '#s=' + btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
    }

    input.addEventListener('input', render);
    for (const button of fontButtons) {
        button.addEventListener('click', () => {
            font = button.dataset.demoFont;
            fontButtons.forEach((b) => b.setAttribute('aria-selected', b === button));
            render();
        });
    }
    for (const button of formatButtons) {
        button.addEventListener('click', () => {
            format = button.dataset.demoFormat;
            formatButtons.forEach((b) => b.setAttribute('aria-selected', b === button));
            render();
        });
    }
    render();
}
