import { z, defineCollection } from 'astro:content';

const photos = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.string(),
    location: z.string().optional(),
    image: image(),
    featured: z.boolean().default(false),
    span: z.string().optional().default('col-span-1 row-span-1'),
  })
});

export const collections = {
  photos,
};
