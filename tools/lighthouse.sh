#!/usr/bin/env bash
# Audit Lighthouse (mobile) des pages principales, sur un build prd servi en local.
# Usage : npm run lighthouse
set -euo pipefail
cd "$(dirname "$0")/.."
export CHROME_PATH="${CHROME_PATH:-/usr/bin/google-chrome}"
OUT=$(mktemp -d)
SITE_ENV=prd npx astro build >/dev/null
npx astro preview --port 4330 >/dev/null 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null || true; rm -rf "$OUT"' EXIT
until curl -s -o /dev/null http://localhost:4330/; do sleep 0.5; done
for p in / /catalogue-soins/ /reiki/ /contactez-moi/; do
  npx -y lighthouse@12 "http://localhost:4330$p" --quiet --chrome-flags="--headless=new --no-sandbox" \
    --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="$OUT/r.json" >/dev/null 2>&1 || true
  python3 -I - "$OUT/r.json" "$p" <<'PY'
import json, sys
r = json.load(open(sys.argv[1]))
if r.get('runtimeError'): print(sys.argv[2], 'ERREUR', r['runtimeError']); sys.exit()
print(f"{sys.argv[2]:<22}", '  '.join(f"{c['title'][:13]} {round(c['score']*100)}" for c in r['categories'].values()))
for a in r['audits'].values():
    if a['score'] is not None and a['score'] < 0.9 and a['scoreDisplayMode'] not in ('informative', 'notApplicable', 'manual'):
        print('   ·', a['id'], a.get('displayValue', ''))
PY
done
