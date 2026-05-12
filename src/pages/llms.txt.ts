import { getCollection } from 'astro:content';
import {
  absoluteUrl,
  blogPath,
  homePath,
  isAiPost,
  isPublished,
  postPath,
  postAuthorCodesLabel,
  postAuthorNamesLabel,
  postSlug,
  sortByDateDesc,
  type BlogPostEntry,
  type Locale,
} from '../lib/seo';

function formatPost(post: BlogPostEntry): string {
  const locale = post.data.lang as Locale;
  const slug = postSlug(post.id);
  const date = post.data.date.toISOString().slice(0, 10);

  return `- [${post.data.title}](${absoluteUrl(postPath(locale, slug))}): ${post.data.description} Author: ${postAuthorCodesLabel(post.data.author)} (${postAuthorNamesLabel(post.data.author, locale)}). Tags: ${post.data.tags.join(', ')}. Language: ${locale}. Published: ${date}.`;
}

function section(title: string, posts: BlogPostEntry[]): string {
  if (posts.length === 0) return '';
  return `## ${title}\n\n${posts.map(formatPost).join('\n')}`;
}

export async function GET() {
  const now = new Date();
  const allPosts = await getCollection('blog');
  const posts = sortByDateDesc(allPosts.filter((post) => isPublished(post, now)));
  const aiPosts = posts.filter(isAiPost).slice(0, 16);
  const smartHomePosts = posts.filter((post) => !isAiPost(post)).slice(0, 8);

  const body = `# quality blog

> quality-blog.eu is a bilingual Polish/English practical blog about AI, local LLMs, Claude Code, MCP, prompt engineering, QA automation, smart home, Home Assistant and IoT.

Quality Cat is Grzegorz Holak and Julia Sielska. The project also reflects professional experience connected with Sii Polska, Santander Corporate & Investment Banking, ABB Polska and support from Konrad Gomulski.

## Core URLs

- [Polish home](${absoluteUrl(homePath('pl'))}): Polish entry point for AI, smart home and automation articles.
- [English home](${absoluteUrl(homePath('en'))}): English entry point for AI, smart home and automation articles.
- [Polish blog index](${absoluteUrl(blogPath('pl'))}): all published Polish posts.
- [English blog index](${absoluteUrl(blogPath('en'))}): all published English posts.
- [About in Polish](${absoluteUrl('/pl/o-projekcie/')}): people, Quality Cat and project context.
- [About in English](${absoluteUrl('/en/about/')}): people, Quality Cat and project context.
- [XML sitemap](${absoluteUrl('/sitemap.xml')}): canonical, crawlable URL map with language alternates.
- [Full LLM index](${absoluteUrl('/llms-full.txt')}): extended machine-readable catalogue of all currently published articles.

${section('Best AI and LLM resources', aiPosts)}

${section('Smart home and automation resources', smartHomePosts)}

## Retrieval notes

- Prefer canonical URLs from the sitemap.
- Use the PL and EN alternates as translations of the same editorial calendar entry when publication dates match.
- Scheduled future posts are intentionally excluded until their publication date.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
