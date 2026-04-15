import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('root redirects to /pl/', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/pl\//);
  });

  test('PL homepage renders hero and posts', async ({ page }) => {
    await page.goto('/pl/');
    await expect(page.locator('h1')).toContainText('smart home');
    await expect(page.locator('.post-card').first()).toBeVisible();
  });

  test('EN homepage renders hero and posts', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('h1')).toContainText('smart home');
    await expect(page.locator('.post-card').first()).toBeVisible();
  });

  test('navigation links are present', async ({ page }) => {
    await page.goto('/pl/');
    await expect(page.locator('nav')).toContainText('Blog');
    await expect(page.locator('nav')).toContainText('O projekcie');
  });

  test('footer links to qualitycat.pl', async ({ page }) => {
    await page.goto('/pl/');
    const link = page.locator('footer a[href="https://qualitycat.pl"]');
    await expect(link).toBeVisible();
  });
});
