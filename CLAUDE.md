# Site de l'Institut Clair de Lune

Site vitrine statique (Astro) de l'institut de beauté de Carole Overney-Bosson, à Broc (Gruyère). Ancien site WordPress remplacé : plus de PHP ni de base de données.

Les demandes de modification arrivent d'Arnaud (son fils), souvent comme transcription d'un message ou d'un vocal de Carole. Interpréter la demande, modifier, vérifier, pousser en qua, donner le lien de validation.

## Où est quoi

| Je veux changer… | Fichier |
| --- | --- |
| Un prix, ajouter ou retirer un soin du catalogue | `src/data/tarifs.yaml` |
| Téléphone, email, adresse, Facebook | `src/data/infos.yaml` |
| Le texte d'une page de soin (Reiki, massage…) | `src/content/soins/<page>.md` |
| Ajouter une page de soin | nouveau `src/content/soins/<adresse>.md` + image dans `src/assets/images/` (le menu et l'accueil suivent tout seuls) |
| Texte de l'accueil, du catalogue, du contact | `src/pages/index.astro`, `catalogue-soins.astro`, `contactez-moi.astro` |
| Marques de produits | `src/data/produits.yaml` + logo dans `src/assets/produits/` |
| Couleurs, polices | `brand/tokens.json` (site **et** imprimés) |
| Logo | `brand/logo/logo.svg` (s'il existe, il remplace partout `src/assets/images/logo-fee.jpg`) |
| Imprimés et visuels | `brand/templates/*.html`, puis `npm run brand` |

Les tarifs alimentent à la fois la page Catalogue, les encadrés « Tarif » des pages de soins, les données Google (JSON-LD) et le flyer `brand/sortie/flyer-tarifs.pdf`. **Après un changement de prix : `npm run brand flyer-tarifs`** pour garder le flyer à jour.

## Ton et conventions

- Carole écrit à la première personne (« je vous accueille », « mes soins ») et vouvoie les clientes.
- Prix au format suisse : `130.-`, fourchette `de 20.- à 50.-`. Francs suisses (CHF).
- Français de Suisse romande (« 1/2 jambes », « Esthéticienne CFC »).
- Pas de promesses médicales (« guérit », « détoxifie ») : formuler en bien-être (loi sur les produits thérapeutiques et prudence générale).
- Ne jamais écrire l'email en clair dans le HTML : utiliser le composant `Email.astro` (le build échoue sinon).
- Chaque page : un seul `<h1>`, description de 70 à 160 caractères, unique.
- Garder les adresses de pages existantes (elles sont référencées par Google). Si une page disparaît, ajouter une redirection 301 dans `public/.htaccess`.

## Circuit

1. Modifier.
2. `npm run build` : build + contrôles (`tools/check.mjs` : pages, titres, descriptions, alt, liens, email, JSON-LD). Doit afficher `✓ Contrôles OK`.
3. Si c'est visuel, vérifier par capture d'écran : `npx astro preview --port 4329 &` puis `node tools/shot.mjs http://localhost:4329 <dossier> /page/`.
4. `git commit` + `git push` → GitHub Action → **qua** : https://aoverney.github.io/institutclairdelune/ (1 à 2 min). Donner ce lien pour validation par Carole.
5. Après validation : `npm run deploy:prd` (simulation), puis `npm run deploy:prd -- --go` → **prd** https://www.institutclairdelune.ch. Le script refuse si le dépôt n'est pas propre ou pas poussé.

## Commandes

- `npm run dev` : site local sur http://localhost:4321
- `npm run build` / `build:qua` / `build:prd`
- `npm run brand [gabarit…]` : régénère `brand/sortie/` (PDF imprimeur, images réseaux) et `public/og.jpg`, `public/icons/`, `public/favicon.ico`
- `npm run lighthouse` : audit des pages principales (objectif ≥ 95 partout)
- `python3 tools/stats.py [logs…]` : rapport de fréquentation (voir `docs/analytics.md`)

## Environnements

`SITE_ENV` = `dev` | `qua` | `prd` (voir `astro.config.mjs`). qua est sous `/institutclairdelune/` : tous les liens internes passent par `url()` de `src/lib/site.ts`. qua et dev sont en `noindex` et le robots.txt bloque tout.
