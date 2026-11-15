#!/usr/bin/env bash
# Déploiement prd vers Infomaniak (rsync en SSH).
# Usage : npm run deploy:prd           → simulation (rien n'est envoyé)
#         npm run deploy:prd -- --go   → envoi réel
# Prérequis : entrée « Host clairdelune » dans ~/.ssh/config et chemin du site ci-dessous.
set -euo pipefail
cd "$(dirname "$0")/.."

HOST="${DEPLOY_HOST:-clairdelune}"
DEST="${DEPLOY_PATH:-A_DEFINIR}"   # ex. sites/institutclairdelune.ch/ (dossier racine du site chez Infomaniak)
[[ "$DEST" == A_DEFINIR ]] && { echo "✗ Chemin de destination à définir (DEPLOY_PATH ou dans ce script)"; exit 1; }

if [[ -n "$(git status --porcelain)" ]]; then echo "✗ Modifications non commitées : commit d'abord (prd = ce qui a été validé en qua)."; exit 1; fi
git fetch -q origin main
if [[ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]]; then echo "✗ HEAD différent de origin/main : pousse d'abord pour que qua = prd."; exit 1; fi

SITE_ENV=prd npm run build

MODE=(--dry-run)
[[ "${1:-}" == "--go" ]] && MODE=()
# --delete : supprime côté serveur ce qui n'existe plus ; ik-logs et autres dossiers serveur protégés.
rsync -avz --delete "${MODE[@]}" \
  --exclude 'ik-logs/' --exclude '.well-known/' --exclude '_wordpress_backup/' \
  dist/ "$HOST:$DEST"

if [[ ${#MODE[@]} -gt 0 ]]; then echo; echo "ℹ Simulation seulement. Relancer avec : npm run deploy:prd -- --go"
else git tag -f "prd-$(date +%Y%m%d-%H%M)" && echo "✓ Déployé, tag créé (git push --tags pour le partager)"; fi
