import { test, expect } from '@playwright/test';

test('it works', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vite/);
});
