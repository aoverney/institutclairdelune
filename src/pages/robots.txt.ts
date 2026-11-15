import type { APIRoute } from 'astro';
// prd : tout est indexable. dev/qua : rien ne doit être indexé.
export const GET: APIRoute = ({ site }) => {
  const prd = import.meta.env.SITE_ENV === 'prd';
  const body = prd
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', new URL(import.meta.env.BASE_URL, site))}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
