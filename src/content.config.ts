import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Une page par soin : src/content/soins/<adresse-de-la-page>.md
const soins = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/soins' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      // Titre court pour les menus et cartes
      court: z.string(),
      description: z.string().max(170),
      image: image(),
      imageAlt: z.string(),
      // Identifiants des lignes de src/data/tarifs.yaml liées à ce soin
      tarifs: z.array(z.string()).default([]),
      ordre: z.number(),
    }),
});

export const collections = { soins };
