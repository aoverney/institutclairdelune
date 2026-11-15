#!/usr/bin/env bash
# Archive quotidienne des logs d'accès Infomaniak (conservés ~7 jours seulement chez eux).
# À lancer chaque jour par cron (sur le NUC ou la tour), par ex. :
#   15 6 * * * /chemin/vers/site_clair_de_lune/tools/archive-logs.sh >> ~/archives/clairdelune-logs/cron.log 2>&1
# Prérequis : « Host clairdelune » dans ~/.ssh/config (clé sans mot de passe ou agent).
set -euo pipefail
HOST="${DEPLOY_HOST:-clairdelune}"
SRC="${LOGS_PATH:-ik-logs/}"                       # dossier des logs à la racine de l'hébergement
DEST="${LOGS_ARCHIVE:-$HOME/archives/clairdelune-logs}"
mkdir -p "$DEST/brut"
# Copie sans jamais supprimer : les fichiers effacés chez Infomaniak restent dans l'archive.
rsync -az --ignore-existing --include='*/' --include='*access*' --exclude='*' "$HOST:$SRC" "$DEST/brut/"
# Le log du jour en cours change : on le recopie à part, sous un nom daté.
rsync -az --include='*/' --include='*access*' --exclude='*' "$HOST:$SRC" "$DEST/courant/"
echo "$(date -Is) archive OK"
