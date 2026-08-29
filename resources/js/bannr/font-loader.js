// One lazy chunk per curated .flf — only the fonts actually picked are
// ever downloaded, never the full figlet library. Keep in sync with fonts.js.
const flfModules = {
    'Standard': () => import('figlet/importable-fonts/Standard.js'),
    'Big': () => import('figlet/importable-fonts/Big.js'),
    'Slant': () => import('figlet/importable-fonts/Slant.js'),
    'Small': () => import('figlet/importable-fonts/Small.js'),
    'Small Slant': () => import('figlet/importable-fonts/Small Slant.js'),
    'Banner': () => import('figlet/importable-fonts/Banner.js'),
    'Block': () => import('figlet/importable-fonts/Block.js'),
    'Doom': () => import('figlet/importable-fonts/Doom.js'),
    'Mini': () => import('figlet/importable-fonts/Mini.js'),
    'Shadow': () => import('figlet/importable-fonts/Shadow.js'),
    'Ogre': () => import('figlet/importable-fonts/Ogre.js'),
    'Script': () => import('figlet/importable-fonts/Script.js'),
    'Larry 3D': () => import('figlet/importable-fonts/Larry 3D.js'),
    'Star Wars': () => import('figlet/importable-fonts/Star Wars.js'),
    'Colossal': () => import('figlet/importable-fonts/Colossal.js'),
    'Cybermedium': () => import('figlet/importable-fonts/Cybermedium.js'),
    'Cyberlarge': () => import('figlet/importable-fonts/Cyberlarge.js'),
    'Speed': () => import('figlet/importable-fonts/Speed.js'),
    'Rectangles': () => import('figlet/importable-fonts/Rectangles.js'),
    'Chunky': () => import('figlet/importable-fonts/Chunky.js'),
    'Roman': () => import('figlet/importable-fonts/Roman.js'),
    'Isometric1': () => import('figlet/importable-fonts/Isometric1.js'),
    'Graffiti': () => import('figlet/importable-fonts/Graffiti.js'),
    'Epic': () => import('figlet/importable-fonts/Epic.js'),
    'Sub-Zero': () => import('figlet/importable-fonts/Sub-Zero.js'),
    'Thin': () => import('figlet/importable-fonts/Thin.js'),
    'Straight': () => import('figlet/importable-fonts/Straight.js'),
    'Stick Letters': () => import('figlet/importable-fonts/Stick Letters.js'),
    'Digital': () => import('figlet/importable-fonts/Digital.js'),
    '3-D': () => import('figlet/importable-fonts/3-D.js'),
    '3D-ASCII': () => import('figlet/importable-fonts/3D-ASCII.js'),
    'Modular': () => import('figlet/importable-fonts/Modular.js'),
    'Soft': () => import('figlet/importable-fonts/Soft.js'),
    'Lean': () => import('figlet/importable-fonts/Lean.js'),
    'Bulbhead': () => import('figlet/importable-fonts/Bulbhead.js'),
    'Ghost': () => import('figlet/importable-fonts/Ghost.js'),
    'Nancyj': () => import('figlet/importable-fonts/Nancyj.js'),
    'Gothic': () => import('figlet/importable-fonts/Gothic.js'),
    'Basic': () => import('figlet/importable-fonts/Basic.js'),
    'Banner3': () => import('figlet/importable-fonts/Banner3.js'),
    'Slant Relief': () => import('figlet/importable-fonts/Slant Relief.js'),
    'Varsity': () => import('figlet/importable-fonts/Varsity.js'),
    'Puffy': () => import('figlet/importable-fonts/Puffy.js'),
    'Rounded': () => import('figlet/importable-fonts/Rounded.js'),
    'Tombstone': () => import('figlet/importable-fonts/Tombstone.js'),
    'Wavy': () => import('figlet/importable-fonts/Wavy.js'),
    'Weird': () => import('figlet/importable-fonts/Weird.js'),
    'Term': () => import('figlet/importable-fonts/Term.js'),
    'ANSI Shadow': () => import('figlet/importable-fonts/ANSI Shadow.js'),
    'Bloody': () => import('figlet/importable-fonts/Bloody.js'),
    'Calvin S': () => import('figlet/importable-fonts/Calvin S.js'),
    'Pagga': () => import('figlet/importable-fonts/Pagga.js'),
    'DOS Rebel': () => import('figlet/importable-fonts/DOS Rebel.js'),
    'Elite': () => import('figlet/importable-fonts/Elite.js'),
    'Delta Corps Priest 1': () => import('figlet/importable-fonts/Delta Corps Priest 1.js'),
};

const loaded = new Map();

export async function loadFont(figlet, id) {
    if (loaded.has(id)) return loaded.get(id);

    const importer = flfModules[id];
    if (!importer) throw new Error(`Police inconnue : ${id}`);

    const promise = importer().then((mod) => {
        figlet.parseFont(id, mod.default);
        return id;
    });

    loaded.set(id, promise);
    promise.catch(() => loaded.delete(id));
    return promise;
}
