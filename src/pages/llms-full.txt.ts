import { getCollection } from 'astro:content';
import {
  absoluteUrl,
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

function postLine(post: BlogPostEntry): string {
  const locale = post.data.lang as Locale;
  const date = post.data.date.toISOString().slice(0, 10);
  const slug = postSlug(post.id);

  return [
    `### ${post.data.title}`,
    '',
    `- URL: ${absoluteUrl(postPath(locale, slug))}`,
    `- Language: ${locale}`,
    `- Published: ${date}`,
    `- Author: ${postAuthorCodesLabel(post.data.author)} (${postAuthorNamesLabel(post.data.author, locale)})`,
    `- Reading time: ${post.data.readingTime} min`,
    `- Tags: ${post.data.tags.join(', ')}`,
    `- Summary: ${post.data.description}`,
  ].join('\n');
}

function groupedSection(title: string, posts: BlogPostEntry[]): string {
  return `## ${title}\n\n${posts.map(postLine).join('\n\n')}`;
}

export async function GET() {
  const now = new Date();
  const allPosts = await getCollection('blog');
  const posts = sortByDateDesc(allPosts.filter((post) => isPublished(post, now)));
  const aiPosts = posts.filter(isAiPost);
  const otherPosts = posts.filter((post) => !isAiPost(post));

  const body = `# quality blog - full LLM catalogue

This file is a compact Markdown catalogue for AI assistants, retrieval systems and search crawlers. It lists every currently published article on quality-blog.eu with canonical URLs, language, tags, publication date and editorial summary.

Entity summary:

- Site: quality blog, https://quality-blog.eu
- Publisher/project: Quality Cat, https://qualitycat.pl
- Quality Cat people: Grzegorz Holak and Julia Sielska
- Professional context: Grzegorz Holak is connected with Sii Polska and Santander Corporate & Investment Banking; Julia Sielska is connected with ABB Polska; Konrad Gomulski is connected with Sii Polska.
- Main topics: AI, local LLMs, Claude Code, MCP, prompt engineering, QA automation, smart home, Home Assistant, Zigbee, Matter, IoT.
- Primary languages: Polish and English.

${groupedSection('AI, LLM, QA and automation articles', aiPosts)}

${groupedSection('Smart home and IoT articles', otherPosts)}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
