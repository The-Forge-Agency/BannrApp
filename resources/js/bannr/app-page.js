import figlet from 'figlet';
import { FONTS, findFont } from './fonts.js';
import { loadFont } from './font-loader.js';
import { FORMATS, findFormat } from './wrappers.js';
import { LAYOUTS, renderFile } from './render.js';
import { DEFAULT_STATE, hashToState, stateToHash } from './share.js';
import { trimArt } from './layout.js';

const TAGS = [
    { id: 'all', label: 'Toutes' },
    { id: 'classique', label: 'Classique' },
    { id: 'compact', label: 'Compact' },
    { id: 'bloc', label: 'Bloc' },
    { id: '3d', label: '3D' },
    { id: 'fantaisie', label: 'Fantaisie' },
    { id: 'unicode', label: 'Unicode' },
];

const EMPTY_RESULT = { art: '', block: '', file: '', nonAscii: [], forced: false };

function escapeHtml(text) {
    return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function bannrComponent() {
    return {
        state: { ...DEFAULT_STATE, custom: { ...DEFAULT_STATE.custom } },
        fonts: FONTS,
        formats: FORMATS,
        layouts: LAYOUTS,
        tags: TAGS,
        fontTag: 'all',
        previews: {},
        result: { ...EMPTY_RESULT },
        toast: '',
        truncatedLink: false,
        renderTimer: null,
        previewTimer: null,
        renderSeq: 0,

        get currentFormat() {
            return findFormat(this.state.format);
        },

        get visibleFonts() {
            return this.fonts.filter((font) => {
                if (this.state.asciiOnly && !font.ascii) return false;
                return this.fontTag === 'all' || font.tags.includes(this.fontTag);
            });
        },

        get fileStats() {
            const lines = this.result.file.split('\n').length - 1;
            return `${lines} lignes · ${new TextEncoder().encode(this.result.file).length} o`;
        },

        // The art is highlighted inside the wrapper so the eye finds it,
        // but the text content stays byte-identical to what gets copied.
        get highlighted() {
            const file = this.result.file;
            const art = this.result.art;
            if (!art) return escapeHtml(file);
            const artLines = art.split('\n');
            const fileLines = file.split('\n');
            const start = fileLines.findIndex((line) => line.includes(artLines[0]));
            if (start < 0 || !fileLines.slice(start, start + artLines.length).every((line, i) => line.includes(artLines[i]))) {
                return escapeHtml(file);
            }
            return fileLines
                .map((line, i) => {
                    if (i < start || i >= start + artLines.length) return escapeHtml(line);
                    const idx = line.indexOf(artLines[i - start]);
                    return escapeHtml(line.slice(0, idx)) + '<span class="art">' + escapeHtml(artLines[i - start]) + '</span>' + escapeHtml(line.slice(idx + artLines[i - start].length));
                })
                .join('\n');
        },

        init() {
            const restored = hashToState(window.location.hash);
            if (restored) {
                this.state = restored.state;
                this.truncatedLink = restored.truncated;
            }
            if (this.state.asciiOnly && !findFont(this.state.font).ascii) this.fontTag = 'all';

            this.$watch('state.text', () => this.schedulePreviews());
            this.$watch('state.asciiOnly', () => this.schedulePreviews());
            this.$watch('fontTag', () => this.schedulePreviews());
            this.$watch('state.layout', () => this.schedulePreviews());

            window.addEventListener('hashchange', () => {
                const next = hashToState(window.location.hash);
                if (next && !next.truncated) {
                    this.state = next.state;
                    this.scheduleRender();
                }
            });

            this.render();
            this.schedulePreviews();
        },

        pickFont(id) {
            this.state.font = id;
            this.scheduleRender();
        },

        scheduleRender() {
            clearTimeout(this.renderTimer);
            this.renderTimer = setTimeout(() => this.render(), 60);
        },

        async render() {
            const seq = ++this.renderSeq;
            try {
                const result = await renderFile(this.state);
                if (seq !== this.renderSeq) return;
                this.result = result;
                this.syncHash();
            } catch (error) {
                console.error(error);
                this.result = { ...EMPTY_RESULT };
                this.notify('Police indisponible, réessaie.');
            }
        },

        syncHash() {
            const hash = this.state.text.trim() ? stateToHash(this.state) : '';
            if (hash === null) return;
            const url = window.location.pathname + window.location.search + hash;
            window.history.replaceState(null, '', url);
        },

        schedulePreviews() {
            clearTimeout(this.previewTimer);
            this.previewTimer = setTimeout(() => this.renderPreviews(), 120);
        },

        // Thumbnails render YOUR text in each font; fonts load lazily, a
        // handful at a time so the first ones appear immediately.
        async renderPreviews() {
            const sample = (this.state.text.trim() || 'Bannr').slice(0, 14);
            const fonts = this.visibleFonts;
            const batch = 6;
            for (let i = 0; i < fonts.length; i += batch) {
                await Promise.all(
                    fonts.slice(i, i + batch).map(async (font) => {
                        try {
                            await loadFont(figlet, font.id);
                            const art = figlet.textSync(sample, { font: font.id, horizontalLayout: this.state.layout, width: 60, whitespaceBreak: true });
                            this.previews[font.id] = trimArt(art);
                        } catch {
                            this.previews[font.id] = '(indisponible)';
                        }
                    }),
                );
            }
        },

        async copy() {
            await this.toClipboard(this.result.file, `Copié · prêt à coller dans ${this.currentFormat.filename}`);
        },

        async copyArt() {
            await this.toClipboard(this.result.art + '\n', 'Art copié (sans wrapper)');
        },

        async toClipboard(text, message) {
            try {
                await navigator.clipboard.writeText(text);
                this.notify(message);
            } catch {
                this.notify('Copie impossible ici : sélectionne le texte à la main.');
            }
        },

        download() {
            const format = this.currentFormat;
            const blob = new Blob([this.result.file], { type: format.mime + ';charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = format.filename;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            this.notify(`${format.filename} téléchargé`);
        },

        async share() {
            const hash = stateToHash(this.state);
            if (!hash) {
                this.notify('Trop long pour tenir dans un lien.');
                return;
            }
            const url = window.location.origin + window.location.pathname + hash;
            if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
                try {
                    await navigator.share({ title: 'Bannr', url });
                    return;
                } catch {
                    // fall through to clipboard
                }
            }
            await this.toClipboard(url, 'Lien copié · il contient tout, rien n\'est stocké');
        },

        notify(message) {
            this.toast = message;
            clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => (this.toast = ''), 2200);
        },
    };
}
