import { getCollection } from 'astro:content';
import {
  absoluteUrl,
  blogPath,
  dayKey,
  homePath,
  isPublished,
  localizedAlternates,
  postAlternatePaths,
  postPath,
  postSlug,
  sortByDateDesc,
  tagPath,
  type AlternatePaths,
  type BlogPostEntry,
  type Locale,
} from '../lib/seo';

type SitemapEntry = {
  path: string;
  lastmod?: Date;
  alternates?: AlternatePaths;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function latestDate(posts: BlogPostEntry[], locale: Locale): Date | undefined {
  return sortByDateDesc(posts.filter((post) => post.data.lang === locale))[0]?.data.date;
}

function postEntries(posts: BlogPostEntry[]): SitemapEntry[] {
  return posts.map((post) => {
    const slug = postSlug(post.id);
    const locale = post.data.lang as Locale;
    const alternates = postAlternatePaths(posts, post);

    return {
      path: postPath(locale, slug),
      lastmod: post.data.date,
      alternates,
    };
  });
}

function tagEntries(posts: BlogPostEntry[], locale: Locale): SitemapEntry[] {
  const tags = [...new Set(posts.filter((post) => post.data.lang === locale).flatMap((post) => post.data.tags))];

  return tags.map((tag) => ({
    path: tagPath(locale, tag),
    lastmod: latestDate(posts.filter((post) => post.data.tags.includes(tag)), locale),
  }));
}

function alternateLinks(alternates?: AlternatePaths): string {
  if (!alternates) return '';

  return Object.entries(alternates)
    .filter(([, path]) => Boolean(path))
    .map(([lang, path]) =>
      `    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(absoluteUrl(path!))}" />`,
    )
    .join('\n');
}

function renderUrl(entry: SitemapEntry): string {
  const links = alternateLinks(entry.alternates);
  const lastmod = entry.lastmod ? `    <lastmod>${escapeXml(dayKey(entry.lastmod))}</lastmod>\n` : '';

  return [
    '  <url>',
    `    <loc>${escapeXml(absoluteUrl(entry.path))}</loc>`,
    lastmod.trimEnd(),
    links,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function GET() {
  const now = new Date();
  const allPosts = await getCollection('blog');
  const posts = sortByDateDesc(allPosts.filter((post) => isPublished(post, now)));

  const plLatest = latestDate(posts, 'pl');
  const enLatest = latestDate(posts, 'en');
  const plHomeAlternates = localizedAlternates('/pl/', '/en/');
  const blogAlternates = localizedAlternates('/pl/blog/', '/en/blog/');
  const aboutAlternates = localizedAlternates('/pl/o-projekcie/', '/en/about/');
  const holakScaleAlternates = localizedAlternates('/pl/skala-holaka-3/', '/en/holak-scale-3/');

  const staticEntries: SitemapEntry[] = [
    { path: homePath('pl'), lastmod: plLatest, alternates: plHomeAlternates },
    { path: homePath('en'), lastmod: enLatest, alternates: plHomeAlternates },
    { path: blogPath('pl'), lastmod: plLatest, alternates: blogAlternates },
    { path: blogPath('en'), lastmod: enLatest, alternates: blogAlternates },
    { path: '/pl/o-projekcie/', alternates: aboutAlternates },
    { path: '/en/about/', alternates: aboutAlternates },
    { path: '/pl/skala-holaka-3/', alternates: holakScaleAlternates },
    { path: '/en/holak-scale-3/', alternates: holakScaleAlternates },
  ];

  const entries = [
    ...staticEntries,
    ...postEntries(posts),
    ...tagEntries(posts, 'pl'),
    ...tagEntries(posts, 'en'),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(renderUrl).join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
