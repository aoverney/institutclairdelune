// Génère le kit de marque à partir de brand/templates/*.html, brand/tokens.json et src/data/*.yaml.
// Sorties : brand/sortie/ (PDF imprimeur, images réseaux sociaux, signature) et public/ (og.jpg, icônes).
// Usage : npm run brand  [nom-de-gabarit ...]
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import YAML from 'yaml';
import QRCode from 'qrcode';
import puppeteer from 'puppeteer-core';

const root = resolve(import.meta.dirname, '..');
const T = join(root, 'brand/templates');
const OUT = join(root, 'brand/sortie');
const TMP = join(root, 'brand/.build');
mkdirSync(OUT, { recursive: true }); mkdirSync(TMP, { recursive: true });

const tokens = JSON.parse(readFileSync(join(root, 'brand/tokens.json'), 'utf8'));
const infos = YAML.parse(readFileSync(join(root, 'src/data/infos.yaml'), 'utf8'));
const tarifs = YAML.parse(readFileSync(join(root, 'src/data/tarifs.yaml'), 'utf8'));
const SITE = 'https://www.institutclairdelune.ch/';

const svgLogo = join(root, 'brand/logo/logo.svg');
const logo = pathToFileURL(existsSync(svgLogo) ? svgLogo : join(root, 'src/assets/images/logo-fee.jpg')).href;
const texture = join(root, 'src/assets/textures/ciel.jpg');
const cielVar = existsSync(texture) ? `--ciel-img:url(${pathToFileURL(texture).href});` : '';
const qr = await QRCode.toString(SITE, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: tokens.color.aubergine.hex, light: '#0000' } });

const font = (pkg, file) => pathToFileURL(join(root, 'node_modules/@fontsource-variable', pkg, 'files', file)).href;
const kebab = (s) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
const head = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'Cormorant Garamond Variable';src:url(${font('cormorant-garamond', 'cormorant-garamond-latin-wght-normal.woff2')}) format('woff2');font-weight:300 700}
@font-face{font-family:'Jost Variable';src:url(${font('jost', 'jost-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900}
:root{${cielVar}${Object.entries(tokens.color).map(([k, v]) => `--c-${kebab(k)}:${v.hex}`).join(';')};${Object.entries(tokens.font).map(([k, v]) => `--f-${k}:'${v.family}',${v.fallback}`).join(';')}}
</style><link rel="stylesheet" href="${pathToFileURL(join(T, '_base.css')).href}">`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const prix = (p) => (Array.isArray(p) ? `de ${p[0]}.- à ${p[1]}.-` : `${p}.-`);
const tarifsHtml = tarifs.sections.map((s) => `<section><h2>${esc(s.titre)}</h2>${s.groupes.map((g) =>
  `${g.titre ? `<h3>${esc(g.titre)}</h3>` : ''}<ul>${g.lignes.map((l) =>
    `<li><span>${esc(l.nom)}${l.detail ? `<small>${esc(l.detail)}</small>` : ''}</span><span class="pts"></span><span class="px">${prix(l.prix)}${l.remarque ? ` (${esc(l.remarque)})` : ''}</span></li>`).join('')}</ul>${g.note ? `<p class="note">${esc(g.note)}</p>` : ''}`).join('')}</section>`).join('');

const get = (path) => path.split('.').reduce((o, k) => o?.[k], { infos });
const fill = (html) => html
  .replace(/\{\{logo\}\}/g, logo).replace(/\{\{qr\}\}/g, qr).replace(/\{\{tarifs\}\}/g, tarifsHtml)
  .replace(/\{\{([\w.]+)\}\}/g, (m, p) => { const v = get(p); if (v == null) throw new Error(`Variable inconnue ${m}`); return esc(v); });

const only = process.argv.slice(2);
const files = readdirSync(T).filter((f) => f.endsWith('.html') && !f.startsWith('_') && (!only.length || only.includes(f.replace('.html', ''))));
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? '/usr/bin/google-chrome', args: ['--no-sandbox', '--allow-file-access-from-files'] });

for (const f of files) {
  const src = readFileSync(join(T, f), 'utf8');
  const meta = (k) => src.match(new RegExp(`@${k}[ \\t]+(\\S+)`))?.[1];
  const format = src.match(/@format[ \t]+(\S+)[ \t]+(\S+)/)?.slice(1);
  const nom = f.replace('.html', '');
  const sortie = meta('sortie');
  const html = fill(src);
  if (sortie === 'html') { writeFileSync(join(OUT, f), html.replace(/<!--[\s\S]*?-->\s*/, '')); console.log(`✓ ${f}`); continue; }
  const tmp = join(TMP, f); writeFileSync(tmp, head + html);
  const page = await browser.newPage();
  const [w, h] = format;
  if (w.endsWith('px')) await page.setViewport({ width: parseInt(w), height: parseInt(h), deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  if (sortie === 'pdf') {
    await page.pdf({ path: join(OUT, `${nom}.pdf`), preferCSSPageSize: true, printBackground: true });
    console.log(`✓ ${nom}.pdf`);
  } else {
    const type = sortie === 'jpg' ? 'jpeg' : 'png';
    const out = join(OUT, `${nom}.${sortie}`);
    await page.screenshot({ path: out, type, ...(type === 'jpeg' ? { quality: 88 } : {}), clip: { x: 0, y: 0, width: parseInt(w), height: parseInt(h) } });
    console.log(`✓ ${nom}.${sortie}`);
    const copie = meta('copie');
    if (copie) { copyFileSync(out, join(root, copie)); console.log(`  → ${copie}`); }
    if (/@icones/.test(src)) {
      mkdirSync(join(root, 'public/icons'), { recursive: true });
      execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
src, d = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA')
for n, s in (('icon-512', 512), ('icon-192', 192), ('apple-touch-icon', 180)):
    im.resize((s, s), Image.LANCZOS).save(f'{d}/icons/{n}.png', optimize=True)
im.resize((48, 48), Image.LANCZOS).save(f'{d}/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
`, out, join(root, 'public')]);
      console.log('  → public/icons/*.png, public/favicon.ico');
    }
  }
  await page.close();
}
await browser.close();
rmSync(TMP, { recursive: true, force: true });
