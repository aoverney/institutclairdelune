# Charte Clair de Lune

Source unique pour le site et les imprimés : **`tokens.json`** (couleurs, polices). Le site lit ce fichier (`src/components/Tokens.astro`), les gabarits aussi (`tools/brand.mjs`).

## Univers

Une gamme de **mauves et violets** (choix de Carole : ni bleu ni rose vif). Un ciel de nuit fait de fumées violettes (texture `src/assets/textures/ciel.jpg`), une lune lavande, et sur ce fond des cartouches lavande pâle à fin filet violet, comme sur ses cartes et sachets cadeaux (`sources/sachets-cadeaux-cartes.jpg`).

| Couleur | Hex | Usage |
| --- | --- | --- |
| Nuit | `#1f1830` | fonds sombres |
| Aubergine | `#3a2550` | titres |
| Violet | `#5e4380` | boutons, accents |
| Violet foncé | `#4a3366` | survol, liens |
| Mauve | `#8a6fa8` | accents doux |
| Lavande moyen | `#b7a6d0` | filets |
| Lilas | `#d9cce8` | liens sur fond sombre |
| Lavande | `#ebe4f3` | cartouches, fonds doux |

Valeurs CMJN indicatives dans `tokens.json`, à faire confirmer par l'imprimeur (épreuve papier recommandée pour les violets).

**Polices** (libres, auto-hébergées) : *Cormorant Garamond* pour les titres et le nom, *Jost* pour le texte. Le nom s'écrit **CLAIR DE LUNE** en capitales espacées (0,18 em), avec en dessous *Esthétique et bien-être*.

## Logo

- Provisoire : `sources/logo-fee-raster.jpg` (image d'origine du site, 1024 px), recadré en rond et teinté en mauve (ailes bleues d'origine) dans `src/assets/images/logo-fee.jpg`.
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

## Illustrations

Les illustrations des soins et la texture de fond sont générées localement (ComfyUI, Flux 3 Klein distillé, 16 étapes, cfg 1, euler/simple, 1216×912). Prompts et graines dans `sources/illustrations.md`. La photo de l'accueil est une vraie photo de l'institut (originale : `sources/photo-institut-originale.jpg`, filtre vintage vert d'époque). Retouche classique dans `institut-soin-retouche.jpg` (étalonnage, sans IA). Une restauration par IA a été essayée puis écartée : le visage reconstruit n'était pas ressemblant. **Ne pas retoucher les visages réels par IA.** Les anciennes images (Midjourney, 2024) sont dans `archive/wordpress/wp-images/`.
