import { test, expect } from '@playwright/test';

test.describe('i18n', () => {
  test('language switcher navigates to EN', async ({ page }) => {
    await page.goto('/pl/');
    await page.locator('.lang-switch').click();
    await expect(page).toHaveURL(/\/en\//);
  });

  test('EN page has English content', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('h1')).toContainText('We share knowledge');
  });

  test('PL page has Polish content', async ({ page }) => {
    await page.goto('/pl/');
    await expect(page.locator('h1')).toContainText('Dzielimy się wiedzą');
  });

  test('EN about page exists', async ({ page }) => {
    await page.goto('/en/about/');
    await expect(page.locator('h1')).toContainText('About');
  });

  test('PL about page exists', async ({ page }) => {
    await page.goto('/pl/o-projekcie/');
    await expect(page.locator('h1')).toContainText('O projekcie');
  });
});
