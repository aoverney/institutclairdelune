# Charte Clair de Lune

Source unique pour le site et les imprimés : **`tokens.json`** (couleurs, polices). Le site lit ce fichier (`src/components/Tokens.astro`), les gabarits aussi (`tools/brand.mjs`).

## Univers

Un ciel de nuit fumé, du bleu nuit au prune et au magenta (comme les cartes et sachets cadeaux de l'institut, voir `sources/sachets-cadeaux-cartes.jpg`), une lune lavande et la fée aux ailes bleues. Sur ce fond, des cartouches lavande pâle à fin filet violet.

| Couleur | Hex | Usage |
| --- | --- | --- |
| Nuit | `#1c1633` | fonds sombres |
| Prune | `#431747` | titres, dégradés |
| Magenta | `#a3246f` | boutons, accents |
| Lavande | `#e8e0f2` | cartouches, fonds doux |
| Lavande moyen | `#b8a5d8` | filets |
| Rose poudré | `#f4dbe7` | petits accents |
| Bleu aile | `#4f93d6` | très rarement |

Valeurs CMJN indicatives dans `tokens.json`, à faire confirmer par l'imprimeur (épreuve papier recommandée pour le prune et le magenta).

**Polices** (libres, auto-hébergées) : *Cormorant Garamond* pour les titres et le nom, *Jost* pour le texte. Le nom s'écrit **CLAIR DE LUNE** en capitales espacées (0,18 em), avec en dessous *Esthétique et bien-être*.

## Logo

- Provisoire : `sources/logo-fee-raster.jpg` (image d'origine du site, 1024 px), recadré en rond dans `src/assets/images/logo-fee.jpg`.
- Définitif : déposer la fée vectorisée en **`logo/logo.svg`** (carré, fond inclus ou transparent). Elle remplace alors automatiquement le logo sur le site et dans tous les gabarits. Relancer ensuite `npm run brand` (icônes, favicon, og.jpg, imprimés).
- Toujours sur fond nuit ou dans un rond ; ne pas déformer ; pas d'ombre portée sur fond clair.

## Imprimés (`npm run brand` → `sortie/`)

| Fichier | Format | Remarque |
| --- | --- | --- |
| `carte-visite.pdf` | 85 × 55 mm, recto/verso | + 3 mm de fond perdu, QR code vers le site |
| `carte-rendez-vous.pdf` | 85 × 55 mm, recto/verso | verso à remplir à la main |
| `bon-cadeau.pdf` | A6 paysage, recto/verso | champs à remplir à la main |
| `flyer-tarifs.pdf` | A5 | généré depuis `src/data/tarifs.yaml` |
| `og.jpg` | 1200 × 630 | partage du site (copié dans `public/`) |
| `facebook-couverture.png` | 1640 × 624 | couverture Facebook |
| `profil.png` | 720 × 720 | photo de profil Facebook / WhatsApp / Google |
| `google-couverture.jpg` | 1200 × 900 | couverture de la fiche Google |
| `signature-email.html` | | ouvrir, tout copier, coller dans Gmail → Paramètres → Signature |

Pour l'imprimeur : PDF en RVB avec fond perdu, sans traits de coupe. Si l'imprimeur exige du CMJN / PDF/X, convertir avec Ghostscript ou le lui demander (la plupart des imprimeurs en ligne suisses acceptent le RVB).
