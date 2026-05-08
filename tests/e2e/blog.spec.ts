import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('PL blog listing shows posts', async ({ page }) => {
    await page.goto('/pl/blog/');
    await expect(page.locator('h1')).toContainText('Wszystkie wpisy');
    await expect(page.locator('.post-card').first()).toBeVisible();
  });

  test('clicking a post card opens the post', async ({ page }) => {
    await page.goto('/pl/blog/');
    await page.locator('.post-card').first().click();
    await expect(page).toHaveURL(/\/pl\/blog\/.+/);
    await expect(page.locator('article')).toBeVisible();
  });

  test('blog post has back link', async ({ page }) => {
    await page.goto('/pl/blog/');
    await page.locator('.post-card').first().click();
    const backLink = page.locator('.post-footer a');
    await expect(backLink).toBeVisible();
  });

  test('code blocks are readable in default dark theme before theme toggle', async ({ page }) => {
    await page.goto('/pl/blog/open-webui-frontend-do-lokalnego-llm/');

    const codeBlock = page.locator('.astro-code').first();
    await expect(codeBlock).toBeVisible();

    await page.locator('html').evaluate((html) => html.removeAttribute('data-theme'));

    const firstToken = codeBlock.locator('span[style*="--shiki-dark"]').first();
    await expect(firstToken).toBeVisible();

    await expect(codeBlock).toHaveCSS('background-color', 'rgb(34, 39, 46)');
    await expect(firstToken).toHaveCSS('color', 'rgb(246, 157, 80)');
  });
});
