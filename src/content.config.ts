import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    lang: z.enum(['pl', 'en']),
    readingTime: z.number(),
    author: z.union([z.enum(['GH', 'JS', 'KG']), z.array(z.enum(['GH', 'JS', 'KG']))]),
  }),
});

export const collections = { blog };
