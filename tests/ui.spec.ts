import { test, expect } from '@playwright/test';

test.describe('Photo Portfolio UI/UX', () => {
  test('homepage has correct metadata and renders main sections', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Check title
    await expect(page).toHaveTitle(/Photo Portfolio/);

    // Ensure hero section is visible
    await expect(page.locator('text=Trungtt Photography').first()).toBeVisible();

    // Check main navigation links in header
    await expect(page.locator('header nav a', { hasText: /^Home$/ })).toBeVisible();
    await expect(page.locator('header nav a', { hasText: /^Gallery$/ })).toBeVisible();
    await expect(page.locator('header nav a', { hasText: /^Contact$/ })).toBeVisible();
  });

  test('gallery page renders and displays photos or empty state', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');

    // Ensure "All Photos" filter exists
    await expect(page.locator('button:has-text("All Photos")')).toBeVisible();

    // Should have a search input
    await expect(page.locator('input[placeholder="Search photos..."]')).toBeVisible();

    // The photos are loaded dynamically over API. Wait for either an image to appear or the "No photos found" message
    const hasImage = page.locator('img').first();
    const hasEmptyState = page.locator('text=No photos found matching your criteria').first();

    await expect(hasImage.or(hasEmptyState)).toBeVisible({ timeout: 10000 });
  });

  test('contact page form interaction', async ({ page }) => {
    await page.goto('http://localhost:3000/contact');

    // Fill out form
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="subject"]').fill('Test Subject');
    await page.locator('textarea[name="message"]').fill('This is a test message from Playwright.');

    // Ensure submit button exists
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
