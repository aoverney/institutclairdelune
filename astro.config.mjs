// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Trois environnements : dev (local), qua (GitHub Pages), prd (Infomaniak).
// Choisi par la variable SITE_ENV au build.
const ENVS = {
  dev: { site: 'http://localhost:4321', base: '/' },
  qua: { site: 'https://aoverney.github.io', base: '/institutclairdelune/' },
  prd: { site: 'https://www.institutclairdelune.ch', base: '/' },
};
const env = process.env.SITE_ENV ?? 'dev';
if (!ENVS[env]) throw new Error(`SITE_ENV inconnu : ${env}`);

export default defineConfig({
  ...ENVS[env],
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  vite: { define: { 'import.meta.env.SITE_ENV': JSON.stringify(env) } },
});
