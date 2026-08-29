@extends('layouts.app')

@section('page', 'landing')

@section('body')
<div class="min-h-screen flex flex-col">
    <div class="w-full max-w-6xl mx-auto px-5 flex-1">
        <nav class="flex items-center justify-between py-5">
            @include('partials.brand')
            <div class="flex items-center gap-3 sm:gap-5">
                <a href="#comment" class="muted text-sm hover:text-[color:var(--ink)] transition-colors hidden sm:inline">Comment ça marche</a>
                <a href="#exemples" class="muted text-sm hover:text-[color:var(--ink)] transition-colors hidden sm:inline">Exemples</a>
                <a href="https://github.com/The-Forge-Agency/BannrApp" target="_blank" rel="noopener" class="muted text-sm hover:text-[color:var(--ink)] transition-colors hidden sm:inline">GitHub</a>
                <span class="kicker hidden sm:inline" style="border: 1px solid var(--bd); padding: 5px 13px; border-radius: 20px;">#17/52</span>
                <a href="{{ route('app') }}" class="btn btn-primary btn-sm">Commencer</a>
            </div>
        </nav>

        <section class="text-center pt-10 sm:pt-16 pb-6 max-w-3xl mx-auto">
            <span class="pill">App #17/52 · 100% local, rien n'est envoyé nulle part</span>
            <h1 class="hero-title text-4xl sm:text-6xl mt-6 mb-5">Ton texte en ASCII art, prêt à coller dans ton <span style="color: var(--accent);">code</span></h1>
            <p class="muted text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                Les générateurs te lâchent un pavé brut à enrober à la main. Bannr te rend le fichier final :
                enrobé dans la bonne syntaxe de commentaire, valide, et garanti ASCII 7 bits pour s'afficher partout.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                <a href="{{ route('app') }}" class="btn btn-primary">Essayer maintenant</a>
                <a href="#exemples" class="btn">Voir un exemple</a>
            </div>
            <p class="muted text-sm mt-4">Zéro compte · gratuit · open source</p>
        </section>

        <section id="exemples" class="mt-8 sm:mt-12 max-w-4xl mx-auto scroll-mt-6" aria-label="Démonstration">
            <div class="term glow-ring">
                <div class="term-bar">
                    <span class="term-dots" aria-hidden="true"><i></i><i></i><i></i></span>
                    <span class="mono text-xs muted" id="demo-filename">robots.txt</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                    <div class="p-4 sm:p-5 space-y-4" style="border-bottom: 1px solid var(--bd);">
                        <div>
                            <p class="kicker mb-2">1 · Tape</p>
                            <input id="demo-input" type="text" class="input mono" value="hello" maxlength="14" autocomplete="off" spellcheck="false" aria-label="Texte de démonstration">
                        </div>
                        <div>
                            <p class="kicker mb-2">2 · Police</p>
                            <div class="flex flex-wrap gap-2">
                                <button type="button" class="chip" data-demo-font="Standard" aria-selected="true">Standard</button>
                                <button type="button" class="chip" data-demo-font="Slant">Slant</button>
                                <button type="button" class="chip" data-demo-font="Big">Big</button>
                                <button type="button" class="chip" data-demo-font="Doom">Doom</button>
                                <button type="button" class="chip" data-demo-font="Small">Small</button>
                            </div>
                        </div>
                        <div>
                            <p class="kicker mb-2">3 · Fichier</p>
                            <div class="flex flex-wrap gap-2">
                                <button type="button" class="chip" data-demo-format="robots" aria-selected="true">robots.txt</button>
                                <button type="button" class="chip" data-demo-format="js-block">JS</button>
                                <button type="button" class="chip" data-demo-format="markdown">README</button>
                                <button type="button" class="chip" data-demo-format="html">HTML</button>
                            </div>
                        </div>
                        <a id="demo-try" href="{{ route('app') }}" data-base="{{ route('app') }}" class="btn btn-primary w-full">Ouvrir dans Bannr →</a>
                    </div>
                    <pre id="demo-output" class="term-body" style="min-height: 260px;" aria-live="polite"></pre>
                </div>
            </div>
            <p class="muted text-xs mono mt-3 text-center">ce que tu vois, c'est le fichier final · colle-le tel quel, ça marche du premier coup</p>
        </section>

        <section id="comment" class="mt-16 sm:mt-24 scroll-mt-6">
            <h2 class="font-display font-bold text-2xl sm:text-3xl text-center" style="letter-spacing: -0.6px;">Ce que ça fait</h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
                <div class="card p-5">
                    <span class="step-num">1</span>
                    <h3 class="font-display font-semibold text-lg mt-4 mb-2">Rendu en direct, chez toi</h3>
                    <p class="muted text-sm leading-relaxed">Tu tapes, l'ASCII art s'affiche pendant la frappe. figlet.js tourne dans ton navigateur : aucune requête ne part avec ton texte.</p>
                </div>
                <div class="card p-5">
                    <span class="step-num">2</span>
                    <h3 class="font-display font-semibold text-lg mt-4 mb-2">Enrobé dans la bonne syntaxe</h3>
                    <p class="muted text-sm leading-relaxed">README (bloc de code), JavaScript (<span class="mono">/* */</span> ou <span class="mono">//</span>), robots.txt (<span class="mono">#</span>), HTML, Python, Shell, CSS, JSONC ou ton propre préfixe. Le fichier reste valide.</p>
                </div>
                <div class="card p-5">
                    <span class="step-num">3</span>
                    <h3 class="font-display font-semibold text-lg mt-4 mb-2">ASCII 7 bits garanti</h3>
                    <p class="muted text-sm leading-relaxed">Bannr détecte les glyphes non-ASCII d'une police et peut forcer un rendu strictement collable partout : Windows, vieux terminaux, fichiers latin-1.</p>
                </div>
            </div>
        </section>

        <section class="mt-16 sm:mt-24 max-w-4xl mx-auto">
            <div class="card p-6 sm:p-8 text-center">
                <p class="kicker mb-3">easter egg</p>
                <h2 class="font-display font-bold text-2xl sm:text-3xl" style="letter-spacing: -0.6px;">GitHub et Airbnb cachent une signature dans leur robots.txt</h2>
                <p class="muted mt-3 max-w-xl mx-auto">Le nôtre aussi, évidemment. Fais-en autant dans le tien : dix secondes, pas une ligne de <span class="mono">#</span> à taper.</p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    <a href="{{ route('app') }}" class="btn btn-primary">Faire le mien</a>
                    <a href="{{ asset('robots.txt') }}" target="_blank" rel="noopener" class="btn mono">/robots.txt</a>
                </div>
            </div>
        </section>
    </div>

    <footer class="w-full max-w-6xl mx-auto px-5 py-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm muted" style="border-top: 1px solid var(--bd);">
        <span>Bannr · app #17/52 · <a href="https://the-forge.agency" target="_blank" rel="noopener" class="hover:text-[color:var(--ink)] transition-colors">TFA52</a></span>
        <span class="flex items-center gap-4">
            <a href="https://github.com/The-Forge-Agency/BannrApp" target="_blank" rel="noopener" class="hover:text-[color:var(--ink)] transition-colors">Open source</a>
            <a href="https://buymeacoffee.com/theforgeagency" target="_blank" rel="noopener" class="hover:text-[color:var(--ink)] transition-colors">☕ Financé par des dons</a>
        </span>
    </footer>
</div>
@endsection
