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

  test('gallery page renders, handles empty state, and supports Add to Cart', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');

    // Ensure "All Photos" filter exists
    await expect(page.locator('button:has-text("All Photos")')).toBeVisible();

    // Check search input
    await expect(page.locator('input[placeholder="Search photos..."]')).toBeVisible();

    const hasImage = page.locator('img').first();
    const hasEmptyState = page.locator('text=No photos found matching your criteria').first();

    // Wait for either photo grid or empty state
    await expect(hasImage.or(hasEmptyState)).toBeVisible({ timeout: 10000 });

    // If photos are present, test the Lightbox and Add to Cart feature
    if (await hasImage.isVisible()) {
      await hasImage.click(); // Open lightbox

      // Wait for lightbox to appear
      const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
      // Ensure the e-commerce purchase section is visible
      await expect(addToCartButton).toBeVisible({ timeout: 5000 });

      // Click Add to cart
      await addToCartButton.click();
      await expect(page.locator('button:has-text("✓ Added")')).toBeVisible();

      // Close lightbox (using ESC key)
      await page.keyboard.press('Escape');

      // Check header cart count
      await expect(page.locator('header text=🛒 Cart1').or(page.locator('header text=🛒1'))).toBeVisible();

      // Navigate to checkout
      await page.goto('http://localhost:3000/checkout');
      await expect(page.locator('text=Order Summary')).toBeVisible();

      const proceedButton = page.locator('button:has-text("Proceed to Checkout")');
      await proceedButton.click();
      await expect(page.locator('text=Payment Successful!')).toBeVisible({ timeout: 5000 });
    }
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
