# Institut Clair de Lune

Site statique de l'[Institut Clair de Lune](https://www.institutclairdelune.ch), institut de beauté à Broc (Gruyère), construit avec [Astro](https://astro.build).

- **qua** (validation) : https://aoverney.github.io/institutclairdelune/, mis à jour à chaque push sur `main`
- **prd** : https://www.institutclairdelune.ch (Infomaniak), via `npm run deploy:prd -- --go`

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # build + contrôles
npm run brand      # imprimés et visuels (brand/sortie/)
```

Guide de modification : [CLAUDE.md](CLAUDE.md). Charte : [brand/README.md](brand/README.md). Analytics : [docs/analytics.md](docs/analytics.md). Référencement hors site : [docs/seo-local.md](docs/seo-local.md). Mise en production : [docs/mise-en-production.md](docs/mise-en-production.md).

`archive/wordpress/` contient une copie du HTML et des images de l'ancien site WordPress (novembre 2026), pour référence.
