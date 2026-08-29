import Alpine from 'alpinejs';
import { bannrComponent } from './bannr/app-page.js';
import { initLanding } from './bannr/landing.js';
import { wrap, FORMATS } from './bannr/wrappers.js';
import { findNonAscii, forceAscii } from './bannr/ascii.js';
import { FONTS } from './bannr/fonts.js';
import { encodeState, decodeState } from './bannr/share.js';
import { artToSvg, artToPngBlob } from './bannr/export-image.js';

// The whole engine, exposed for the curious: everything runs client-side.
window.Bannr = { wrap, FORMATS, FONTS, findNonAscii, forceAscii, encodeState, decodeState, artToSvg, artToPngBlob };

const page = document.body.dataset.page;

if (page === 'app') {
    Alpine.data('bannr', bannrComponent);
    window.Alpine = Alpine;
    Alpine.start();
}

if (page === 'landing') initLanding();
