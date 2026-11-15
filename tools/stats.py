#!/usr/bin/env python3
"""Rapport de fréquentation à partir des logs d'accès Apache d'Infomaniak.

Usage : python3 tools/stats.py [dossier-ou-fichiers-de-logs ...] [--depuis AAAA-MM-JJ] [--jusqu AAAA-MM-JJ]
Par défaut : ~/archives/clairdelune-logs/ (rempli par tools/archive-logs.sh).
Sortie : rapport Markdown sur la sortie standard. Aucune dépendance (Python standard).
Les robots sont filtrés ; un « visiteur » = IP + navigateur sur une journée (approximation sans cookie).
"""
import gzip, re, sys
from collections import Counter, defaultdict
from datetime import datetime, date
from pathlib import Path
from urllib.parse import urlsplit, unquote

LIGNE = re.compile(
    r'(?P<ip>\S+) \S+ \S+ \[(?P<t>[^\]]+)\] "(?P<m>[A-Z]+) (?P<u>\S+)[^"]*" (?P<s>\d{3}) \S+'
    r'(?: "(?P<ref>[^"]*)" "(?P<ua>[^"]*)")?')
ROBOTS = re.compile(r'bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|curl|wget|python|go-http|java/|'
                    r'headless|lighthouse|scan|feed|http-client|ahrefs|semrush|bytespider|gptbot|claude|perplexity', re.I)
IGNORER = re.compile(r'^/(_astro/|icons/|favicon|og\.jpg|robots\.txt|sitemap|site\.webmanifest|.*\.(css|js|png|jpe?g|webp|avif|svg|ico|woff2?|xml|txt)$)')
PROPRE = 'institutclairdelune.ch'
JOURS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim']

def fichiers(args):
    cibles = [Path(a).expanduser() for a in args] or [Path('~/archives/clairdelune-logs').expanduser()]
    for c in cibles:
        if c.is_dir():
            yield from sorted(p for p in c.rglob('*') if p.is_file() and ('access' in p.name or p.suffix in ('.log', '.gz')))
        elif c.exists():
            yield c

def lignes(p):
    o = gzip.open if p.suffix == '.gz' else open
    with o(p, 'rt', encoding='utf-8', errors='replace') as f:
        yield from f

def source(ref):
    if not ref or ref == '-':
        return 'Direct / inconnu'
    h = urlsplit(ref).hostname or ''
    if PROPRE in h: return None
    for k, n in (('google', 'Google'), ('bing', 'Bing'), ('duckduckgo', 'DuckDuckGo'), ('qwant', 'Qwant'), ('ecosia', 'Ecosia'),
                 ('facebook', 'Facebook'), ('instagram', 'Instagram'), ('whatsapp', 'WhatsApp'), ('local.ch', 'local.ch'),
                 ('search.ch', 'search.ch'), ('chatgpt', 'ChatGPT'), ('perplexity', 'Perplexity')):
        if k in h: return n
    return h

def appareil(ua):
    return 'Mobile' if re.search(r'Mobile|Android|iPhone', ua) else ('Tablette' if 'iPad' in ua else 'Ordinateur')

def main():
    args, depuis, jusqu = [], None, None
    it = iter(sys.argv[1:])
    for a in it:
        if a == '--depuis': depuis = date.fromisoformat(next(it))
        elif a == '--jusqu': jusqu = date.fromisoformat(next(it))
        else: args.append(a)

    vues, sources, apps, jours, e404, visiteurs = Counter(), Counter(), Counter(), Counter(), Counter(), defaultdict(set)
    contacts, vus, robots, total = Counter(), set(), 0, 0
    for p in fichiers(args):
        for l in lignes(p):
            m = LIGNE.search(l)
            if not m: continue
            ua = m['ua'] or ''
            try: t = datetime.strptime(m['t'].split()[0], '%d/%b/%Y:%H:%M:%S')
            except ValueError: continue
            cle = (m['ip'], m['t'], m['u'])           # évite les doublons si deux archives se recouvrent
            if cle in vus: continue
            vus.add(cle)
            d = t.date()
            if (depuis and d < depuis) or (jusqu and d > jusqu): continue
            total += 1
            if ROBOTS.search(ua) or not ua or ua == '-': robots += 1; continue
            if m['m'] != 'GET': continue
            chemin = unquote(urlsplit(m['u']).path)
            if m['s'] == '404': e404[chemin] += 1; continue
            if not m['s'].startswith('2') or IGNORER.match(chemin): continue
            vues[chemin] += 1
            jours[d] += 1
            visiteurs[d].add((m['ip'], ua))
            s = source(m['ref'])
            if s: sources[s] += 1
            apps[appareil(ua)] += 1
            if chemin.startswith('/contactez-moi'): contacts[d] += 1

    if not jours:
        print('Aucune donnée exploitable.'); return
    nb_vis = sum(len(v) for v in visiteurs.values())
    d0, d1 = min(jours), max(jours)
    pct = lambda n, t: f'{100 * n / t:.0f} %' if t else '–'
    tv = sum(vues.values())
    print(f'# Fréquentation institutclairdelune.ch\n\nPériode : **{d0:%d.%m.%Y} → {d1:%d.%m.%Y}** ({(d1 - d0).days + 1} jours)\n')
    print(f'- Visiteurs (estimation) : **{nb_vis}**\n- Pages vues : **{tv}**\n- Visites de la page Contact : **{sum(contacts.values())}**')
    print(f'- Requêtes de robots filtrées : {robots} sur {total}\n')
    print('## Pages les plus vues\n\n| Page | Vues | Part |\n|---|---:|---:|')
    for c, n in vues.most_common(15): print(f'| `{c}` | {n} | {pct(n, tv)} |')
    print('\n## Provenance\n\n| Source | Vues | Part |\n|---|---:|---:|')
    ts = sum(sources.values())
    for s, n in sources.most_common(12): print(f'| {s} | {n} | {pct(n, ts)} |')
    print('\n## Appareils\n\n| Appareil | Part |\n|---|---:|')
    for a, n in apps.most_common(): print(f'| {a} | {pct(n, tv)} |')
    print('\n## Par jour\n\n| Jour | Visiteurs | Pages vues |\n|---|---:|---:|')
    for d in sorted(jours): print(f'| {JOURS[d.weekday()]} {d:%d.%m} | {len(visiteurs[d])} | {jours[d]} |')
    if e404:
        print('\n## Pages introuvables (404) demandées par des humains\n\n| Adresse | Fois |\n|---|---:|')
        for c, n in e404.most_common(15): print(f'| `{c}` | {n} |')

if __name__ == '__main__':
    main()
