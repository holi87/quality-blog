import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('PL blog listing shows posts', async ({ page }) => {
    await page.goto('/pl/blog/');
    await expect(page.locator('h1')).toContainText('Blog');
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
});
