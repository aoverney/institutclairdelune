import YAML from 'yaml';
import infosRaw from '../data/infos.yaml?raw';
import tarifsRaw from '../data/tarifs.yaml?raw';
import produitsRaw from '../data/produits.yaml?raw';

export const infos = YAML.parse(infosRaw);
export const tarifs = YAML.parse(tarifsRaw) as {
  sections: {
    titre: string;
    groupes: { titre?: string; note?: string; lignes: Ligne[] }[];
  }[];
};
export const produits = YAML.parse(produitsRaw) as {
  nom: string; logo: string; texte: string; lien?: string;
}[];

export type Ligne = {
  id: string; nom: string; detail?: string; remarque?: string;
  prix: number | [number, number]; lien?: string;
};

export const SITE_ENV = import.meta.env.SITE_ENV as 'dev' | 'qua' | 'prd';

/** Chemin interne avec la base de l'environnement (GitHub Pages est sous /institutclairdelune/). */
export function url(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : '/' + path);
}

/** Adresse absolue (balise canonique, Open Graph, données structurées). */
export function absUrl(path = '/') {
  return new URL(url(path), import.meta.env.SITE).href;
}

export function formatPrix(p: Ligne['prix']) {
  return Array.isArray(p) ? `de ${p[0]}.- à ${p[1]}.-` : `${p}.-`;
}

export const toutesLignes: Ligne[] = tarifs.sections.flatMap((s) => s.groupes.flatMap((g) => g.lignes));

export function ligne(id: string): Ligne {
  const l = toutesLignes.find((x) => x.id === id);
  if (!l) throw new Error(`Tarif inconnu dans tarifs.yaml : ${id}`);
  return l;
}

const prixNums = toutesLignes.flatMap((l) => (Array.isArray(l.prix) ? l.prix : [l.prix]));
export const priceRange = `CHF ${Math.min(...prixNums)} – ${Math.max(...prixNums)}`;

/** Fiche de l'institut pour Google (schema.org BeautySalon). */
export function jsonLdInstitut() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': absUrl('/') + '#institut',
    name: infos.nom,
    legalName: infos.raisonSociale,
    description: infos.slogan,
    url: absUrl('/'),
    logo: absUrl('/icons/icon-512.png'),
    image: absUrl('/og.jpg'),
    telephone: infos.telephoneInternational,
    priceRange,
    currenciesAccepted: 'CHF',
    address: {
      '@type': 'PostalAddress',
      streetAddress: infos.adresse.rue,
      postalCode: infos.adresse.npa,
      addressLocality: infos.adresse.localite,
      addressRegion: infos.adresse.canton,
      addressCountry: infos.adresse.pays,
    },
    areaServed: { '@type': 'AdministrativeArea', name: infos.adresse.region },
    employee: { '@type': 'Person', name: infos.praticienne, jobTitle: infos.titre },
    sameAs: [infos.facebook],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Soins et tarifs',
      itemListElement: tarifs.sections.map((s) => ({
        '@type': 'OfferCatalog',
        name: s.titre,
        itemListElement: s.groupes.flatMap((g) => g.lignes).filter((l) => !l.nom.startsWith('+')).map(offre),
      })),
    },
  };
}

export function offre(l: Ligne) {
  const prix = Array.isArray(l.prix)
    ? { '@type': 'PriceSpecification', minPrice: l.prix[0], maxPrice: l.prix[1], priceCurrency: 'CHF' }
    : null;
  return {
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: l.detail ? `${l.nom} (${l.detail})` : l.nom },
    ...(prix ? { priceSpecification: prix } : { price: l.prix, priceCurrency: 'CHF' }),
  };
}
