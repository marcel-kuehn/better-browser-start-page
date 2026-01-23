import { test, expect } from '@playwright/test';

// Small 1x1 pixel PNG for testing
const TEST_IMAGE_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

test.describe('Custom Background', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display custom background input in settings', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // Custom background label should be visible
    const backgroundLabel = page.getByText(/custom background/i);
    await expect(backgroundLabel).toBeVisible();

    // File input should be present
    const fileInput = page.getByTestId('background-image-input');
    await expect(fileInput).toBeAttached();
  });

  test('should upload custom background image', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // Create a test image file
    const fileInput = page.getByTestId('background-image-input');

    // Upload a test image using a data URL converted to file
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      ),
    });

    // Wait for the upload to process
    await page.waitForTimeout(500);

    // Verify custom background is saved in localStorage
    const config = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    expect(config?.settings?.customBackgroundImage).toBeTruthy();
    expect(config?.settings?.customBackgroundImage).toContain('data:image/png;base64');
  });

  test('should show preview when custom background is set', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // Upload a test image
    const fileInput = page.getByTestId('background-image-input');
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      ),
    });

    // Wait for the upload to process
    await page.waitForTimeout(500);

    // Preview image should be visible in the settings
    const previewImage = page.getByTestId('background-preview');
    await expect(previewImage).toBeVisible();
  });

  test('should show clear button when custom background is set', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // Upload a test image
    const fileInput = page.getByTestId('background-image-input');
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      ),
    });

    // Wait for the upload to process
    await page.waitForTimeout(500);

    // Clear button should be visible
    const clearButton = page.getByTestId('clear-background-button');
    await expect(clearButton).toBeVisible();
  });

  test('should clear custom background and revert to theme wallpaper', async ({ page }) => {
    // Set up with custom background
    await page.goto('/');
    await page.evaluate(customBg => {
      const config = {
        _v: '0.0.4',
        settings: { theme: 'glassmorphism', language: 'en', customBackgroundImage: customBg },
        elements: [],
      };
      localStorage.setItem('app_config', JSON.stringify(config));
    }, TEST_IMAGE_BASE64);
    await page.reload();

    // Verify custom background is applied
    const mainLayout = page.getByTestId('main-layout');
    let backgroundStyle = await mainLayout.evaluate(el => el.style.backgroundImage);
    expect(backgroundStyle).toContain('data:image/png;base64');

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // Click clear button
    const clearButton = page.getByTestId('clear-background-button');
    await clearButton.click();

    // Wait for the change to apply
    await page.waitForTimeout(500);

    // Verify background reverted to theme wallpaper
    backgroundStyle = await mainLayout.evaluate(el => el.style.backgroundImage);
    expect(backgroundStyle.toLowerCase()).toContain('wallpaper');

    // Verify localStorage is updated
    const config = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });
    expect(config?.settings?.customBackgroundImage).toBeNull();
  });

  test('should persist custom background after page reload', async ({ page }) => {
    await page.goto('/');

    // Open settings and upload image
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    const fileInput = page.getByTestId('background-image-input');
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      ),
    });

    await page.waitForTimeout(500);

    // Close settings using keyboard shortcut (Escape) as the close button may be outside viewport
    await page.keyboard.press('Escape');

    // Reload the page
    await page.reload();

    // Wait for the page to fully render
    await page.waitForTimeout(500);

    // Verify custom background is still applied
    const mainLayout = page.getByTestId('main-layout');
    const backgroundStyle = await mainLayout.evaluate(el => el.style.backgroundImage);
    expect(backgroundStyle).toContain('data:image/png;base64');
  });

  test('should preserve custom background when switching themes', async ({ page }) => {
    // Set up with custom background and light theme
    await page.goto('/');
    await page.evaluate(customBg => {
      const config = {
        _v: '0.0.4',
        settings: { theme: 'glassmorphism', language: 'en', customBackgroundImage: customBg },
        elements: [],
      };
      localStorage.setItem('app_config', JSON.stringify(config));
    }, TEST_IMAGE_BASE64);
    await page.reload();

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // Switch to dark theme
    const themeSelect = page.getByTestId('theme-select');
    await themeSelect.click();
    const darkOption = page.locator('[role="option"]').filter({ hasText: /dark/i });
    await darkOption.click();

    await page.waitForTimeout(500);

    // Verify custom background is still applied (not overridden by theme)
    const mainLayout = page.getByTestId('main-layout');
    const backgroundStyle = await mainLayout.evaluate(el => el.style.backgroundImage);
    expect(backgroundStyle).toContain('data:image/png;base64');

    // Verify theme changed but custom background preserved
    const config = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });
    expect(config?.settings?.theme).toBe('glassmorphism-dark');
    expect(config?.settings?.customBackgroundImage).toBeTruthy();
  });
});
