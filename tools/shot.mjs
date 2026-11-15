// Captures d'écran des pages (mobile et bureau) pour relecture visuelle.
// Usage : node tools/shot.mjs <url-de-base> <dossier-sortie> [chemins...]
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const [base, out, ...paths] = process.argv.slice(2);
const pages = paths.length ? paths : ['/', '/catalogue-soins/', '/massage-californien/', '/produits-beaute/', '/contactez-moi/'];
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME ?? '/usr/bin/google-chrome', args: ['--no-sandbox'] });
for (const [nom, vp] of [['mobile', { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true }], ['bureau', { width: 1366, height: 900 }]]) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  for (const p of pages) {
    await page.goto(base.replace(/\/$/, '') + p, { waitUntil: 'networkidle0' });
    const f = `${out}/${nom}${p.replace(/\//g, '_') || '_'}.png`;
    await page.screenshot({ path: f, fullPage: true });
    console.log(f);
  }
}
await browser.close();
