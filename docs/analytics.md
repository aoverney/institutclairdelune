# Analytics

Pas de cookies, pas de bandeau, aucun script de suivi sur le site. Deux sources :

## 1. Logs d'accès Infomaniak → `tools/stats.py`

Infomaniak garde les logs Apache environ **7 jours** (dossier `ik-logs/` à la racine de l'hébergement, ou Manager → site → Avancé → Logs). Il faut donc les archiver chaque jour.

1. SSH configuré (`Host clairdelune` dans `~/.ssh/config`, voir `mise-en-production.md`).
2. Vérifier le chemin des logs : `ssh clairdelune ls ik-logs/`, et ajuster `LOGS_PATH` si besoin.
3. Cron quotidien (NUC ou tour) :
   ```
   15 6 * * * /home/arnaud/projects/site_clair_de_lune/tools/archive-logs.sh >> ~/archives/clairdelune-logs/cron.log 2>&1
   ```
4. Rapport : `python3 tools/stats.py --depuis 2026-12-01` (lit `~/archives/clairdelune-logs/`). Avec le rapport, Claude peut commenter : pages vues, provenance (Google, Facebook…), mobile ou ordinateur, visites de la page Contact, 404.

Avant d'automatiser : tester `stats.py` sur un export manuel du Manager (bouton d'export `.log`) pour valider que le format est bien reconnu.

Les archives restent hors du dépôt (adresses IP = données personnelles, dépôt public).

Option tableau de bord : `goaccess ~/archives/clairdelune-logs/brut/* --log-format=COMBINED -o rapport.html` (`sudo apt install goaccess`).

## 2. Google Search Console

Ce que les gens tapent sur Google, à quelle position le site apparaît, combien cliquent, et l'état d'indexation.

1. https://search.google.com/search-console → Ajouter une propriété → **Domaine** `institutclairdelune.ch`.
2. Ajouter l'enregistrement TXT donné par Google dans la zone DNS chez Infomaniak (Manager → Domaine → Zone DNS). Valider.
3. Sitemaps → soumettre `https://www.institutclairdelune.ch/sitemap-index.xml` (après la mise en prd).
4. Pour que Claude lise les données : créer un compte de service dans Google Cloud (API « Search Console API » activée), télécharger sa clé JSON (hors dépôt, ex. `~/.config/clairdelune/gsc.json`), puis ajouter l'adresse du compte de service comme utilisateur (lecture) de la propriété Search Console. Un script `tools/gsc.py` sera écrit à ce moment-là.

Premiers chiffres utiles après 2 à 4 semaines.
