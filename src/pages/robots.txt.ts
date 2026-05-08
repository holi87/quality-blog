import { absoluteUrl } from '../lib/seo';

const SEARCH_AND_AI_USER_AGENTS = [
  '*',
  'Googlebot',
  'Google-Extended',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'CCBot',
];

export function GET() {
  const rules = SEARCH_AND_AI_USER_AGENTS
    .map((agent) => `User-agent: ${agent}\nAllow: /`)
    .join('\n\n');

  return new Response(`${rules}\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
