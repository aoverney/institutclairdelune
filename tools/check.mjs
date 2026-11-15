// Contrôles après build (lancé par `npm run build`). Échoue si un problème est trouvé.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '../dist');
const base = (process.env.SITE_ENV === 'qua' ? '/institutclairdelune' : '');
const erreurs = [];
const err = (m) => erreurs.push(m);

// 1. Les anciennes adresses WordPress existent toujours
for (const p of ['', 'catalogue-soins', 'produits-beaute', 'permanente-des-cils', 'massage-californien', 'reiki', 'drainage-lymphatique', 'contactez-moi']) {
  if (!existsSync(join(dist, p, 'index.html'))) err(`Page manquante : /${p}`);
}
for (const f of ['404.html', 'robots.txt', 'sitemap-index.xml', 'og.jpg', 'favicon.ico', '.htaccess', 'site.webmanifest']) {
  if (!existsSync(join(dist, f))) err(`Fichier manquant : ${f}`);
}

const htmls = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && htmls.push(p); } })(dist);

const email = readFileSync(resolve(import.meta.dirname, '../src/data/infos.yaml'), 'utf8').match(/^email:\s*(\S+)/m)[1];
const titres = new Map(), descs = new Map();
for (const f of htmls) {
  const h = readFileSync(f, 'utf8');
  const nom = f.slice(dist.length) || '/';
  const titre = h.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = h.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!titre) err(`${nom} : pas de <title>`);
  else if (titre.length > 70) err(`${nom} : titre trop long (${titre.length})`);
  if (!desc) err(`${nom} : pas de meta description`);
  else if (desc.length < 70 || desc.length > 170) err(`${nom} : description de ${desc.length} caractères (viser 70-160)`);
  titres.set(titre, [...(titres.get(titre) ?? []), nom]);
  descs.set(desc, [...(descs.get(desc) ?? []), nom]);
  const h1 = (h.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) err(`${nom} : ${h1} balises <h1> (il en faut 1)`);
  for (const img of h.match(/<img\b[^>]*>/g) ?? []) if (!/\salt(=|[\s>])/.test(img)) err(`${nom} : image sans alt : ${img.slice(0, 80)}`);
  if (h.includes(email)) err(`${nom} : l'adresse email apparaît en clair`);
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { err(`${nom} : JSON-LD invalide`); }
  }
  for (const [, href] of h.matchAll(/href="([^"#?]+)/g)) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (base && !href.startsWith(base + '/')) { err(`${nom} : lien sans base qua : ${href}`); continue; }
    const p = join(dist, decodeURI(href.slice(base.length)));
    if (!existsSync(p) && !existsSync(join(p, 'index.html'))) err(`${nom} : lien cassé : ${href}`);
  }
}
for (const [t, ps] of titres) if (ps.length > 1) err(`Titre identique sur ${ps.join(', ')} : ${t}`);
for (const [d, ps] of descs) if (ps.length > 1) err(`Description identique sur ${ps.join(', ')}`);

if (erreurs.length) { console.error(`\n✗ ${erreurs.length} problème(s) :\n  - ` + erreurs.join('\n  - ')); process.exit(1); }
console.log(`✓ Contrôles OK (${htmls.length} pages)`);
