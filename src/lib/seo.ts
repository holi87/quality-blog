import type { CollectionEntry } from 'astro:content';

export const SITE_URL = 'https://quality-blog.eu';
export const SITE_NAME = 'quality blog';
export const PUBLISHER_NAME = 'Quality Cat';
export const AUTHOR_NAME = 'Grzegorz Holak';
export const DEFAULT_OG_IMAGE = '/og-default.svg';

export const POST_AUTHORS = {
  GH: {
    code: 'GH',
    name: AUTHOR_NAME,
    affiliation: [
      { '@type': 'Organization', name: PUBLISHER_NAME, url: 'https://qualitycat.pl' },
      { '@type': 'Organization', name: 'Sii Polska' },
      { '@type': 'Organization', name: 'Santander Corporate & Investment Banking' },
    ],
  },
  JS: {
    code: 'JS',
    name: 'Julia Sielska',
    affiliation: [
      { '@type': 'Organization', name: PUBLISHER_NAME, url: 'https://qualitycat.pl' },
      { '@type': 'Organization', name: 'ABB Polska' },
    ],
  },
} as const;

export const LOCALES = ['pl', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export type AuthorCode = keyof typeof POST_AUTHORS;
export type BlogPostEntry = CollectionEntry<'blog'>;
export type AlternatePaths = Partial<Record<Locale | 'x-default', string>>;
export type JsonLdNode = Record<string, unknown>;

const AI_TAGS = new Set([
  'adopcja',
  'adoption',
  'advisor',
  'agenci',
  'agents',
  'agents-md',
  'ai',
  'automation',
  'automatyzacja',
  'claude-code',
  'coding',
  'content',
  'dokumentacja',
  'documentation',
  'evidence',
  'hyperframes',
  'jira',
  'kodowanie',
  'llm',
  'lm-studio',
  'local-models',
  'lokalne-modele',
  'mac',
  'mcp',
  'modele',
  'models',
  'ollama',
  'open-webui',
  'plugins',
  'prompt-engineering',
  'prompts',
  'prompty',
  'qa',
  'rag',
  'review',
  'skill',
  'skills',
  'strategia',
  'strategy',
  'subagents',
  'subagenty',
  'teams',
  'test-architect',
  'test-automation',
  'tokens',
  'tokeny',
  'tooling',
  'video',
  'wideo',
  'workflow',
  'workflows',
  'workflowy',
  'zespoly',
]);

export function normalizePath(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized === '/') return '/';
  if (/\.[a-z0-9]+$/i.test(normalized)) return normalized;
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const url = new URL(pathOrUrl, SITE_URL);
  url.pathname = normalizePath(url.pathname);
  return url.toString();
}

export function postSlug(postId: string): string {
  return postId.replace(/^[a-z]{2}\//, '');
}

export function postPath(locale: Locale, slug: string): string {
  return `/${locale}/blog/${slug}/`;
}

export function blogPath(locale: Locale): string {
  return `/${locale}/blog/`;
}

export function homePath(locale: Locale): string {
  return `/${locale}/`;
}

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function tagPath(locale: Locale, tag: string): string {
  return `/${locale}/blog/tag/${tagSlug(tag)}/`;
}

export function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isPublished(post: BlogPostEntry, now = new Date()): boolean {
  return post.data.date <= now;
}

export function sortByDateDesc<T extends BlogPostEntry>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function isAiPost(post: BlogPostEntry): boolean {
  const searchable = `${post.data.title} ${post.data.description}`.toLowerCase();
  return post.data.tags.some((tag) => AI_TAGS.has(tag.toLowerCase()))
    || /\b(ai|llm|claude|chatgpt|mcp|ollama|open webui|prompt|agent)\b/i.test(searchable);
}

export function postAuthor(code: AuthorCode) {
  return POST_AUTHORS[code];
}

export function postAuthorName(code: AuthorCode): string {
  return postAuthor(code).name;
}

export function postAuthorJsonLd(code: AuthorCode): JsonLdNode {
  const author = postAuthor(code);
  return {
    '@type': 'Person',
    name: author.name,
    alternateName: author.code,
    worksFor: { '@type': 'Organization', name: PUBLISHER_NAME, url: 'https://qualitycat.pl' },
    affiliation: author.affiliation,
  };
}

function tagOverlapScore(a: BlogPostEntry, b: BlogPostEntry): number {
  const aTags = new Set(a.data.tags.map((tag) => tag.toLowerCase()));
  return b.data.tags.reduce((score, tag) => score + (aTags.has(tag.toLowerCase()) ? 1 : 0), 0);
}

export function findTranslatedPost(
  allPosts: BlogPostEntry[],
  post: BlogPostEntry,
  targetLocale: Locale,
): BlogPostEntry | undefined {
  if (post.data.lang === targetLocale) return post;

  const sameDay = allPosts.filter(
    (candidate) =>
      candidate.data.lang === targetLocale
      && dayKey(candidate.data.date) === dayKey(post.data.date),
  );

  if (sameDay.length <= 1) return sameDay[0];

  return sameDay
    .map((candidate) => ({ candidate, score: tagOverlapScore(post, candidate) }))
    .sort((a, b) => b.score - a.score || postSlug(a.candidate.id).localeCompare(postSlug(b.candidate.id)))[0]
    ?.candidate;
}

export function postAlternatePaths(allPosts: BlogPostEntry[], post: BlogPostEntry): AlternatePaths {
  const plPost = findTranslatedPost(allPosts, post, 'pl');
  const enPost = findTranslatedPost(allPosts, post, 'en');
  const alternates: AlternatePaths = {};

  if (plPost) alternates.pl = postPath('pl', postSlug(plPost.id));
  if (enPost) alternates.en = postPath('en', postSlug(enPost.id));
  alternates['x-default'] = alternates.pl ?? alternates.en;

  return alternates;
}

export function localizedAlternates(plPath: string, enPath: string, xDefault = plPath): AlternatePaths {
  return {
    pl: normalizePath(plPath),
    en: normalizePath(enPath),
    'x-default': normalizePath(xDefault),
  };
}

export function organizationJsonLd(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: PUBLISHER_NAME,
    url: 'https://qualitycat.pl',
    brand: SITE_NAME,
    founder: [postAuthorJsonLd('GH'), postAuthorJsonLd('JS')],
    member: [
      postAuthorJsonLd('GH'),
      postAuthorJsonLd('JS'),
      {
        '@type': 'Person',
        name: 'Konrad Gomulski',
        alternateName: 'Gumis',
        affiliation: { '@type': 'Organization', name: 'Sii Polska' },
      },
    ],
  };
}

export function websiteJsonLd(locale: Locale): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: absoluteUrl('/'),
    name: SITE_NAME,
    description: locale === 'pl'
      ? 'Dwujezyczny blog o AI, lokalnych LLM, automatyzacji, QA, smart home i Home Assistant.'
      : 'A bilingual blog about AI, local LLMs, automation, QA, smart home and Home Assistant.',
    inLanguage: ['pl', 'en'],
    publisher: { '@id': absoluteUrl('/#organization') },
  };
}

export function blogJsonLd(locale: Locale, posts: BlogPostEntry[]): JsonLdNode {
  return {
    '@type': 'Blog',
    '@id': absoluteUrl(`${blogPath(locale)}#blog`),
    url: absoluteUrl(blogPath(locale)),
    name: locale === 'pl' ? 'Blog o AI, LLM i smart home' : 'AI, LLM and smart home blog',
    description: locale === 'pl'
      ? 'Praktyczne artykuly o AI, lokalnych modelach LLM, Claude Code, MCP, QA, automatyzacji i smart home.'
      : 'Practical articles about AI, local LLMs, Claude Code, MCP, QA, automation and smart home.',
    inLanguage: locale,
    publisher: { '@id': absoluteUrl('/#organization') },
    blogPost: posts.slice(0, 12).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.data.title,
      url: absoluteUrl(postPath(locale, postSlug(post.id))),
      datePublished: post.data.date.toISOString(),
      author: postAuthorJsonLd(post.data.author),
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingJsonLd(post: BlogPostEntry, alternates: AlternatePaths): JsonLdNode {
  const locale = post.data.lang as Locale;
  const url = absoluteUrl(alternates[locale] ?? postPath(locale, postSlug(post.id)));

  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.data.title,
    description: post.data.description,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    datePublished: post.data.date.toISOString(),
    dateModified: post.data.date.toISOString(),
    inLanguage: locale,
    isAccessibleForFree: true,
    keywords: post.data.tags,
    articleSection: post.data.tags[0] ?? 'blog',
    timeRequired: `PT${post.data.readingTime}M`,
    author: postAuthorJsonLd(post.data.author),
    publisher: { '@id': absoluteUrl('/#organization') },
    isPartOf: { '@id': absoluteUrl(`${blogPath(locale)}#blog`) },
    about: post.data.tags.map((tag) => ({ '@type': 'Thing', name: tag })),
  };
}

export function aboutPageJsonLd(locale: Locale, path: string): JsonLdNode {
  return {
    '@type': 'AboutPage',
    '@id': `${absoluteUrl(path)}#about`,
    url: absoluteUrl(path),
    name: locale === 'pl' ? 'O projekcie quality blog' : 'About quality blog',
    description: locale === 'pl'
      ? 'Informacje o quality blog, Quality Cat oraz doswiadczeniu autorow zwiazanym z Sii Polska, Santander Corporate & Investment Banking i ABB Polska.'
      : 'Information about quality blog, Quality Cat and the authors professional background connected with Sii Polska, Santander Corporate & Investment Banking and ABB Polska.',
    inLanguage: locale,
    about: { '@id': absoluteUrl('/#organization') },
  };
}
