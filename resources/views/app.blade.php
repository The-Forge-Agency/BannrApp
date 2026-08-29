@extends('layouts.app')

@section('page', 'app')
@section('title', 'Bannr — Générateur ASCII art prêt à coller')

@section('body')
<div class="min-h-screen flex flex-col" x-data="bannr()" x-init="init()">
    <header class="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <nav class="flex items-center justify-between py-4 gap-3">
            @include('partials.brand', ['size' => 30])
            <div class="flex items-center gap-2 sm:gap-3">
                <span class="pill hidden sm:inline-flex" title="Rien ne quitte ton navigateur">
                    <span class="w-2 h-2 rounded-full" style="background: var(--accent); box-shadow: 0 0 8px var(--accent-glow);"></span>
                    100% local · ASCII 7 bits garanti
                </span>
                <span class="kicker hidden md:inline" style="border: 1px solid var(--bd); padding: 5px 13px; border-radius: 20px;">#17/52</span>
                <button type="button" class="btn btn-sm" @click="share()" :disabled="!state.text.trim()">Partager</button>
            </div>
        </nav>
    </header>

    <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-16 flex-1">
        <p x-cloak x-show="truncatedLink" class="pill pill-warn mb-4" x-transition>Le lien était tronqué : on repart d'un éditeur vide.</p>

        <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] gap-5 lg:gap-6">

            {{-- ============ Entrée (col 1, row 1 sur desktop · en premier sur mobile) ============ --}}
            <section class="lg:col-start-1 lg:row-start-1" aria-label="Entrée">
                <div class="card p-4 sm:p-5">
                    <p class="kicker mb-3">1 · Ton texte</p>
                    <input type="text" class="input mono" placeholder="Tape un mot, un nom, un projet…" maxlength="200" autocomplete="off" autocapitalize="off" spellcheck="false" x-model="state.text" @input="scheduleRender()" autofocus>
                    <div class="flex items-center justify-between mt-2 text-xs muted">
                        <span>Rendu en direct · figlet.js dans ton navigateur</span>
                        <span class="mono" x-text="state.text.length + '/200'"></span>
                    </div>
                </div>
            </section>

            {{-- ============ Options (col 1, row 2 sur desktop · en dernier sur mobile) ============ --}}
            <section class="space-y-4 lg:col-start-1 lg:row-start-2 order-3 lg:order-none" aria-label="Police et options">
                <div class="card p-4 sm:p-5">
                    <div class="flex items-center justify-between gap-3 mb-3">
                        <p class="kicker">3 · Police</p>
                        <button type="button" class="btn btn-xs ml-auto" @click="gallery = true" title="Ton texte dans toutes les polices, d'un coup">▦ Tout voir</button>
                        <label class="toggle text-xs muted">
                            <input type="checkbox" x-model="state.asciiOnly">
                            <span class="toggle-track"></span>
                            <span>ASCII-safe uniquement</span>
                        </label>
                    </div>
                    <div class="flex flex-wrap gap-2 mb-3">
                        <template x-for="tag in tags" :key="tag.id">
                            <button type="button" class="chip" :aria-selected="fontTag === tag.id" @click="fontTag = tag.id" x-text="tag.label"></button>
                        </template>
                    </div>
                    <div class="font-grid" role="listbox" aria-label="Polices">
                        <template x-for="font in visibleFonts" :key="font.id">
                            <button type="button" class="font-card" role="option" :aria-selected="state.font === font.id" @click="pickFont(font.id)">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-sm font-medium" x-text="font.name"></span>
                                    <span class="font-badge" :class="font.ascii ? 'is-safe' : 'is-unicode'" x-text="font.ascii ? '7-bit' : 'unicode'"></span>
                                </div>
                                <pre x-text="previews[font.id] ?? '…'"></pre>
                            </button>
                        </template>
                    </div>
                    <p x-cloak x-show="visibleFonts.length === 0" class="muted text-sm text-center py-6">Aucune police ici avec ce filtre. Essaie une autre catégorie.</p>
                </div>

                <div class="card p-4 sm:p-5 space-y-4">
                    <p class="kicker">4 · Mise en forme</p>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="field-label" for="opt-width">Largeur max</label>
                            <input id="opt-width" type="number" class="input input-sm mono" min="20" max="300" step="1" x-model.number="state.width" @input="scheduleRender()">
                        </div>
                        <div>
                            <label class="field-label" for="opt-layout">Espacement</label>
                            <select id="opt-layout" class="select input-sm" x-model="state.layout" @change="scheduleRender()">
                                <template x-for="l in layouts" :key="l.id"><option :value="l.id" x-text="l.label"></option></template>
                            </select>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
                        <div>
                            <span class="field-label">Alignement</span>
                            <div class="seg" role="tablist">
                                <button type="button" class="seg-item" role="tab" :aria-selected="state.align === 'left'" @click="state.align = 'left'; scheduleRender()">Gauche</button>
                                <button type="button" class="seg-item" role="tab" :aria-selected="state.align === 'center'" @click="state.align = 'center'; scheduleRender()">Centre</button>
                                <button type="button" class="seg-item" role="tab" :aria-selected="state.align === 'right'" @click="state.align = 'right'; scheduleRender()">Droite</button>
                            </div>
                        </div>
                        <div>
                            <span class="field-label">Cadre</span>
                            <div class="seg" role="tablist">
                                <button type="button" class="seg-item" role="tab" :aria-selected="state.frame === 'none'" @click="state.frame = 'none'; scheduleRender()">Aucun</button>
                                <button type="button" class="seg-item mono" role="tab" :aria-selected="state.frame === 'box'" @click="state.frame = 'box'; scheduleRender()">+--+</button>
                                <button type="button" class="seg-item mono" role="tab" :aria-selected="state.frame === 'double'" @click="state.frame = 'double'; scheduleRender()">#==#</button>
                                <button type="button" class="seg-item mono" role="tab" :aria-selected="state.frame === 'hash'" @click="state.frame = 'hash'; scheduleRender()">####</button>
                                <button type="button" class="seg-item mono" role="tab" :aria-selected="state.frame === 'stars'" @click="state.frame = 'stars'; scheduleRender()">****</button>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="field-label" for="opt-before">Lignes au-dessus</label>
                            <textarea id="opt-before" class="textarea" rows="2" placeholder="github.com/toi/projet" x-model="state.before" @input="scheduleRender()"></textarea>
                        </div>
                        <div>
                            <label class="field-label" for="opt-after">Lignes en dessous</label>
                            <textarea id="opt-after" class="textarea" rows="2" placeholder="v1.0.0 · made with love" x-model="state.after" @input="scheduleRender()"></textarea>
                        </div>
                    </div>
                </div>

                <div class="card p-4 sm:p-5">
                    <div class="flex items-start justify-between gap-3">
                        <div>
                            <p class="kicker mb-1">5 · Garantie ASCII 7 bits</p>
                            <p class="text-sm muted" x-show="!result.nonAscii.length">
                                <span x-show="state.text.trim()">Rendu strictement 7 bits : collable partout, de Windows aux vieux terminaux.</span>
                                <span x-show="!state.text.trim()">Bannr vérifie chaque caractère du rendu (code point > 127).</span>
                            </p>
                            <p class="text-sm" x-cloak x-show="result.nonAscii.length && !state.force" style="color: var(--warn);">
                                Cette police introduit <span x-text="result.nonAscii.reduce((n, e) => n + e.count, 0)"></span> caractères non-ASCII
                                (<span class="mono" x-text="result.nonAscii.slice(0, 6).map((e) => e.char).join(' ')"></span>).
                                Ils peuvent s'afficher en charabia ailleurs.
                            </p>
                            <p class="text-sm" x-cloak x-show="result.forced" style="color: var(--accent);">
                                Forcé en 7 bits : <span x-text="result.nonAscii.reduce((n, e) => n + e.count, 0)"></span> glyphes remplacés, rendu collable partout.
                            </p>
                        </div>
                        <label class="toggle shrink-0 text-sm">
                            <input type="checkbox" x-model="state.force" @change="scheduleRender()">
                            <span class="toggle-track"></span>
                            <span>Forcer 7 bits</span>
                        </label>
                    </div>
                    <div class="seg mt-3" role="tablist" x-cloak x-show="state.force">
                        <button type="button" class="seg-item" role="tab" :aria-selected="state.forceMode === 'translit'" @click="state.forceMode = 'translit'; scheduleRender()">Translittérer (█ → #)</button>
                        <button type="button" class="seg-item" role="tab" :aria-selected="state.forceMode === 'strip'" @click="state.forceMode = 'strip'; scheduleRender()">Retirer</button>
                    </div>
                </div>
            </section>

            {{-- ============ Format & aperçu (col 2 sur desktop · juste après le texte sur mobile) ============ --}}
            <section class="space-y-4 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-4 lg:self-start" aria-label="Export">
                <div class="card p-4 sm:p-5">
                    <p class="kicker mb-3">2 · Fichier cible</p>
                    <div class="flex flex-wrap gap-2" role="listbox" aria-label="Formats">
                        <template x-for="format in formats" :key="format.id">
                            <button type="button" class="chip" role="option" :aria-selected="state.format === format.id" @click="state.format = format.id; scheduleRender()" x-text="format.label"></button>
                        </template>
                    </div>

                    <div x-cloak x-show="state.format === 'custom'" class="mt-4 space-y-3" x-transition>
                        <div class="seg" role="tablist">
                            <button type="button" class="seg-item" role="tab" :aria-selected="state.custom.mode === 'line'" @click="state.custom.mode = 'line'; scheduleRender()">Par ligne</button>
                            <button type="button" class="seg-item" role="tab" :aria-selected="state.custom.mode === 'block'" @click="state.custom.mode = 'block'; scheduleRender()">Bloc</button>
                        </div>
                        <div class="grid grid-cols-2 gap-3" x-show="state.custom.mode === 'line'">
                            <div>
                                <label class="field-label" for="c-prefix">Préfixe</label>
                                <input id="c-prefix" type="text" class="input input-sm mono" placeholder="# " x-model="state.custom.prefix" @input="scheduleRender()">
                            </div>
                            <div>
                                <label class="field-label" for="c-suffix">Suffixe</label>
                                <input id="c-suffix" type="text" class="input input-sm mono" placeholder="(vide)" x-model="state.custom.suffix" @input="scheduleRender()">
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-3" x-show="state.custom.mode === 'block'">
                            <div>
                                <label class="field-label" for="c-open">Ouverture</label>
                                <input id="c-open" type="text" class="input input-sm mono" placeholder="/*" x-model="state.custom.open" @input="scheduleRender()">
                            </div>
                            <div>
                                <label class="field-label" for="c-indent">Indent ligne</label>
                                <input id="c-indent" type="text" class="input input-sm mono" placeholder=" * " x-model="state.custom.indent" @input="scheduleRender()">
                            </div>
                            <div>
                                <label class="field-label" for="c-close">Fermeture</label>
                                <input id="c-close" type="text" class="input input-sm mono" placeholder="*/" x-model="state.custom.close" @input="scheduleRender()">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="term">
                    <div class="term-bar">
                        <span class="term-dots" aria-hidden="true"><i></i><i></i><i></i></span>
                        <span class="mono text-xs muted" x-text="currentFormat.filename"></span>
                        <button type="button" class="pill pill-warn ml-auto" style="padding: 3px 10px; font-size: 11px;" x-cloak x-show="result.nonAscii.length && !state.force" @click="state.force = true; scheduleRender()" title="Remplacer les glyphes non-ASCII">⚠ non-ASCII · forcer 7 bits</button>
                        <span class="pill ml-auto" style="padding: 3px 10px; font-size: 11px;" x-cloak x-show="result.forced">7 bits ✓</span>
                        <span class="mono text-xs muted" :class="{ 'ml-auto': !result.nonAscii.length }" x-show="result.file" x-text="fileStats"></span>
                    </div>
                    <pre class="term-body" :class="result.file ? 'is-file' : 'is-empty'" x-ref="preview" aria-live="polite"><template x-if="!result.file"><span>$ bannr --font "<span x-text="state.font"></span>" --to <span x-text="currentFormat.short"></span>
<span class="cursor"></span>

Tape ton texte pour voir le fichier final,
wrapper de commentaire compris.
Ce que tu vois ici, c'est exactement ce que
« Copier » met dans ton presse-papier.</span></template><template x-if="result.file"><span x-html="highlighted"></span></template></pre>
                </div>

                <div class="sticky-actions">
                    <div class="flex flex-wrap gap-2">
                        <button type="button" class="btn btn-primary w-full sm:w-auto sm:flex-1" @click="copy()" :disabled="!result.file">
                            <span x-text="'Copier · ' + currentFormat.filename"></span>
                        </button>
                        <button type="button" class="btn flex-1" @click="download()" :disabled="!result.file">Télécharger</button>
                        <button type="button" class="btn flex-1 sm:flex-none" @click="copyArt()" :disabled="!result.art" title="L'art seul, sans wrapper">Art seul</button>
                    </div>
                    <div class="flex flex-wrap items-center gap-2 mt-2">
                        <span class="kicker">Image</span>
                        <div class="seg" role="tablist" aria-label="Fond de l'image">
                            <template x-for="theme in imageThemes" :key="theme.id">
                                <button type="button" class="seg-item" role="tab" :aria-selected="imageTheme === theme.id" @click="imageTheme = theme.id" x-text="theme.label"></button>
                            </template>
                        </div>
                        <span class="ml-auto flex gap-2">
                            <button type="button" class="btn btn-xs" @click="copyPng()" :disabled="!result.art" title="Copier l'image dans le presse-papier">Copier PNG</button>
                            <button type="button" class="btn btn-xs" @click="downloadPng()" :disabled="!result.art">PNG</button>
                            <button type="button" class="btn btn-xs" @click="downloadSvg()" :disabled="!result.art">SVG</button>
                        </span>
                    </div>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-2 text-xs muted px-1">
                    <span>Rien n'est envoyé nulle part : tout tourne dans ton navigateur.</span>
                    <span class="flex gap-3">
                        <a href="https://github.com/The-Forge-Agency/BannrApp" target="_blank" rel="noopener" class="hover:text-[color:var(--ink)] transition-colors">Code source</a>
                        <a href="https://buymeacoffee.com/theforgeagency" target="_blank" rel="noopener" class="hover:text-[color:var(--ink)] transition-colors">☕ Offrir un café</a>
                    </span>
                </div>
            </section>
        </div>
    </main>

    {{-- ============ Galerie : toutes les polices, ton texte, ton format ============ --}}
    <div x-cloak x-show="gallery" x-transition.opacity.duration.200ms class="gallery" role="dialog" aria-modal="true" aria-label="Galerie de polices" @click.self="gallery = false">
        <div class="gallery-bar">
            <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center gap-3">
                <span class="font-display font-semibold">Galerie</span>
                <span class="muted text-sm hidden sm:inline" x-text="galleryItems.length + ' polices · ' + currentFormat.filename"></span>
                <input type="text" class="input input-sm mono flex-1 min-w-[140px] max-w-xs" placeholder="Ton texte…" maxlength="200" x-model="state.text" @input="scheduleRender()" autocomplete="off" spellcheck="false">
                <select class="select input-sm" style="width: auto;" x-model="state.format" @change="scheduleRender()" aria-label="Format">
                    <template x-for="format in formats" :key="format.id"><option :value="format.id" x-text="format.label"></option></template>
                </select>
                <label class="toggle text-xs muted">
                    <input type="checkbox" x-model="state.asciiOnly">
                    <span class="toggle-track"></span>
                    <span class="hidden sm:inline">ASCII-safe</span>
                </label>
                <button type="button" class="btn btn-sm ml-auto" @click="gallery = false">Fermer ✕</button>
            </div>
        </div>
        <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 py-5">
            <p x-cloak x-show="!state.text.trim()" class="muted text-center py-16">Tape un texte au-dessus : il s'affiche ici dans toutes les polices d'un coup.</p>
            <p x-cloak x-show="state.text.trim() && galleryItems.length === 0" class="muted text-center py-16">Aucune police avec ce filtre. Décoche « ASCII-safe » ou change de catégorie.</p>
            <div class="gallery-grid" x-show="state.text.trim()">
                <template x-for="item in galleryItems" :key="item.font.id">
                    <article class="gallery-card" :class="{ 'is-current': state.font === item.font.id }">
                        <header class="flex items-center gap-2 mb-2">
                            <span class="text-sm font-medium" x-text="item.font.name"></span>
                            <span class="font-badge" :class="item.font.ascii ? 'is-safe' : 'is-unicode'" x-text="item.font.ascii ? '7-bit' : 'unicode'"></span>
                            <span class="font-badge is-unicode" x-show="item.nonAscii && !item.forced" x-text="'⚠ ' + item.nonAscii"></span>
                            <span class="font-badge is-safe" x-show="item.forced">forcé 7 bits</span>
                            <span class="ml-auto flex gap-1">
                                <button type="button" class="btn btn-xs" @click="useGalleryItem(item)">Choisir</button>
                                <button type="button" class="btn btn-xs btn-primary" @click="copyGalleryItem(item)" :disabled="!item.file">Copier</button>
                            </span>
                        </header>
                        <pre class="gallery-pre" x-text="item.pending ? '…' : item.file"></pre>
                    </article>
                </template>
            </div>
        </div>
    </div>

    <div x-cloak x-show="toast" x-transition.opacity.duration.200ms class="toast" x-text="toast" role="status"></div>
</div>
@endsection
