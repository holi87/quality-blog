import { expect, test } from '@playwright/test';

test.describe('SEO and LLM discoverability', () => {
  test('robots.txt exposes sitemap and AI search crawlers', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBe(true);

    const text = await response.text();
    expect(text).toContain('Sitemap: https://quality-blog.eu/sitemap.xml');
    expect(text).toContain('User-agent: OAI-SearchBot');
    expect(text).toContain('User-agent: ChatGPT-User');
    expect(text).toContain('User-agent: Claude-SearchBot');
    expect(text).toContain('User-agent: Google-Extended');
  });

  test('sitemap includes canonical published URLs with language alternates', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBe(true);

    const xml = await response.text();
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(xml).toContain('<loc>https://quality-blog.eu/pl/blog/open-webui-frontend-do-lokalnego-llm/</loc>');
    expect(xml).toContain('hreflang="en" href="https://quality-blog.eu/en/blog/open-webui-frontend-for-local-llm/"');
    expect(xml).toContain('<lastmod>2026-05-08</lastmod>');
    expect(xml).not.toContain('/pl/blog/subagenci-claude-code-co-to-i-po-co/');
  });

  test('llms.txt gives models a compact site and AI article map', async ({ request }) => {
    const response = await request.get('/llms.txt');
    expect(response.ok()).toBe(true);

    const text = await response.text();
    expect(text).toContain('# quality blog');
    expect(text).toContain('Quality Cat is Grzegorz Holak and Julia Sielska');
    expect(text).toContain('https://quality-blog.eu/llms-full.txt');
    expect(text).toContain('Open WebUI');
    expect(text).toContain('local LLM');
  });

  test('blog post metadata has canonical, hreflang and BlogPosting JSON-LD', async ({ page }) => {
    await page.goto('/pl/blog/open-webui-frontend-do-lokalnego-llm/');

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://quality-blog.eu/pl/blog/open-webui-frontend-do-lokalnego-llm/',
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      'https://quality-blog.eu/en/blog/open-webui-frontend-for-local-llm/',
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /max-snippet:-1/,
    );

    const jsonLdItems = (await page.locator('script[type="application/ld+json"]').allTextContents())
      .map((text) => JSON.parse(text));
    const article = jsonLdItems.find((item) => item['@type'] === 'BlogPosting');
    expect(article).toMatchObject({
      '@id': 'https://quality-blog.eu/pl/blog/open-webui-frontend-do-lokalnego-llm/#article',
      headline: 'Open WebUI — front jak ChatGPT do twojego lokalnego LLM',
      inLanguage: 'pl',
      isAccessibleForFree: true,
      author: {
        name: 'Grzegorz Holak',
        alternateName: 'GH',
      },
    });
    expect(article.author.worksFor.name).toBe('Quality Cat');
    expect(article.publisher['@id']).toBe('https://quality-blog.eu/#organization');
  });

  test('Home Assistant posts expose JS as the article author', async ({ page }) => {
    await page.goto('/pl/blog/hacs-w-home-assistant-os/');

    await expect(page.locator('.post-meta')).toContainText('Autor: Julia Sielska');

    const jsonLdItems = (await page.locator('script[type="application/ld+json"]').allTextContents())
      .map((text) => JSON.parse(text));
    const article = jsonLdItems.find((item) => item['@type'] === 'BlogPosting');

    expect(article.author).toMatchObject({
      name: 'Julia Sielska',
      alternateName: 'JS',
    });
  });

  test('about pages explicitly connect Quality Cat people and professional context', async ({ page }) => {
    await page.goto('/pl/o-projekcie/');
    await expect(page.locator('body')).toContainText('Quality Cat');
    await expect(page.locator('body')).toContainText('Grzegorz Holak');
    await expect(page.locator('body')).toContainText('Julia Sielska');
    await expect(page.locator('body')).toContainText('Sii Polska');
    await expect(page.locator('body')).toContainText('Santander Corporate & Investment Banking');
    await expect(page.locator('body')).toContainText('ABB Polska');

    await page.goto('/en/about/');
    await expect(page.locator('body')).toContainText('Julia Sielska');
    await expect(page.locator('body')).toContainText('Grzegorz Holak');
    await expect(page.locator('body')).toContainText('Konrad');
    await expect(page.locator('body')).toContainText('Filip Barszcz');
  });
});
