# Bannr

**Ton texte en ASCII art, prêt à coller dans ton code.** App #17/52 · TFA52.

Bannr transforme un texte en ASCII art (figlet) et l'exporte déjà enrobé dans la bonne syntaxe de commentaire : README.md, JavaScript, robots.txt, HTML, Python, Shell, CSS, JSONC ou un préfixe personnalisé. Le fichier produit reste valide. Garantie ASCII 7 bits, aperçu fidèle tel-que-collé, partage par lien sans serveur.

Tout tourne côté navigateur. Laravel ne sert que deux pages statiques : aucune donnée n'est envoyée ni stockée.

## Lancer

```sh
composer install
npm install
cp .env.example .env && php artisan key:generate
npm run build      # ou npm run dev
php artisan serve
```

## Tests

```sh
npm run test:js    # modules d'enrobage, garantie 7 bits, mise en forme, partage
php artisan test   # pages
```

## Structure

- `resources/js/bannr/wrappers.js` — un enrobage par format, chacun garanti valide (échappement de `*/`, `-->`, choix du fence Markdown).
- `resources/js/bannr/ascii.js` — détection des glyphes > 127 et mode « forcer 7 bits » (translittération à largeur constante ou retrait).
- `resources/js/bannr/layout.js` — largeur, alignement, cadre, lignes libres.
- `resources/js/bannr/share.js` — état complet encodé dans le fragment d'URL (`#s=…`), jamais envoyé au serveur.
- `resources/js/bannr/fonts.js` — set curé de polices figlet, chargées à la demande.

Gratuit, open source, financé par des dons. Aucun plan payant, jamais.
