import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Nishchinto/);
});

test('dashboard login page loads', async ({ page }) => {
  await page.goto('http://localhost:3003/login');
  await expect(page).toHaveURL(/.*login/);
  // Check for some text that should be on the login page
  await expect(page.getByText(/Sign in/i)).toBeVisible();
});
