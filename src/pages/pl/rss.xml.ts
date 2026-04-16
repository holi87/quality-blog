import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const now = new Date();
  const posts = (await getCollection('blog'))
    .filter((post) => post.data.lang === 'pl' && post.data.date <= now)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'quality blog',
    description: 'Praktyczna wiedza o smart home i AI.',
    site: context.site ?? 'https://quality-blog.eu',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/pl/blog/${post.id.replace(/^[a-z]{2}\//, '')}/`,
      categories: post.data.tags,
    })),
    customData: '<language>pl-pl</language>',
  });
}
