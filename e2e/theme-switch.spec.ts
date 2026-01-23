import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should open settings sidebar', async ({ page }) => {
    await page.goto('/');

    // Click the settings trigger button
    const settingsBtn = page.getByTestId('settings-trigger');
    await settingsBtn.click();

    // Settings sidebar should open
    const sidebar = page.getByTestId('settings-sidebar');
    await expect(sidebar).toBeVisible({ timeout: 5000 });
  });

  test('should display theme selector in settings', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-trigger').click();

    // Wait for sidebar to open
    const sidebar = page.getByTestId('settings-sidebar');
    await expect(sidebar).toBeVisible();

    // Theme selector should be visible
    const themeLabel = page.getByText(/theme/i);
    await expect(themeLabel).toBeVisible();

    // Select element should be present
    const themeSelect = page.getByTestId('theme-select');
    await expect(themeSelect).toBeVisible();
  });

  test('should switch to dark theme', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // Click the theme select
    const themeSelect = page.getByTestId('theme-select');
    await themeSelect.click();

    // Select dark theme option
    const darkOption = page.locator('[role="option"]').filter({ hasText: /dark/i });
    await darkOption.click();

    // Verify theme changed in localStorage
    const config = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    expect(config?.settings?.theme).toBe('glassmorphism-dark');

    // HTML element should have the dark theme class
    const htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('glassmorphism-dark');
  });

  test('should switch to light theme', async ({ page }) => {
    // First set dark theme
    await page.goto('/');
    await page.evaluate(() => {
      const config = {
        _v: '0.0.4',
        settings: { theme: 'glassmorphism-dark', language: 'en' },
        elements: [],
      };
      localStorage.setItem('app_config', JSON.stringify(config));
    });
    await page.reload();

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // Click the theme select
    const themeSelect = page.getByTestId('theme-select');
    await themeSelect.click();

    // Select light theme option (the non-dark one)
    const lightOption = page.locator('[role="option"]').filter({ hasNotText: /dark/i }).first();
    await lightOption.click();

    // Verify theme changed
    const config = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    expect(config?.settings?.theme).toBe('glassmorphism');

    // HTML element should have the light theme class
    const htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('glassmorphism');
    expect(htmlClass).not.toContain('glassmorphism-dark');
  });

  test('should persist theme after page reload', async ({ page }) => {
    await page.goto('/');

    // Open settings and switch to dark theme
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    const themeSelect = page.getByTestId('theme-select');
    await themeSelect.click();

    const darkOption = page.locator('[role="option"]').filter({ hasText: /dark/i });
    await darkOption.click();
    await page.waitForTimeout(500);

    // Close settings using the close button with data-testid
    const closeButton = page.getByTestId('settings-close');
    await closeButton.click();

    // Reload the page
    await page.reload();

    // Verify theme is still dark
    const htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('glassmorphism-dark');

    const config = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });
    expect(config?.settings?.theme).toBe('glassmorphism-dark');
  });

  test('should apply correct background image for theme', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to fully render
    await page.waitForTimeout(500);

    // Check background image on the main layout div
    const mainLayout = page.getByTestId('main-layout');
    const backgroundStyle = await mainLayout.evaluate(el => el.style.backgroundImage);

    // Background should reference the theme wallpaper
    expect(backgroundStyle.toLowerCase()).toContain('wallpaper');
  });

  test('should use custom background over theme wallpaper when set', async ({ page }) => {
    const customBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    await page.goto('/');
    await page.evaluate(customBg => {
      const config = {
        _v: '0.0.4',
        settings: { theme: 'glassmorphism', language: 'en', customBackgroundImage: customBg },
        elements: [],
      };
      localStorage.setItem('app_config', JSON.stringify(config));
    }, customBase64);
    await page.reload();

    // Wait for the page to fully render
    await page.waitForTimeout(500);

    // Check background image on the main layout div
    const mainLayout = page.getByTestId('main-layout');
    const backgroundStyle = await mainLayout.evaluate(el => el.style.backgroundImage);

    // Background should reference the custom image, not the wallpaper
    expect(backgroundStyle).toContain('data:image/png;base64');
    expect(backgroundStyle.toLowerCase()).not.toContain('wallpaper');
  });

  test('should close settings after theme change', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-trigger').click();
    const sidebar = page.getByTestId('settings-sidebar');
    await expect(sidebar).toBeVisible();

    // Change theme
    const themeSelect = page.getByTestId('theme-select');
    await themeSelect.click();

    const option = page.locator('[role="option"]').first();
    await option.click();
    await page.waitForTimeout(300);

    // Close the settings sheet using the data-testid button
    const closeButton = page.getByTestId('settings-close');
    await closeButton.click();
    await page.waitForTimeout(500);

    // Sidebar should be closed
    await expect(sidebar).not.toBeVisible();
  });

  test('should show current theme as selected in dropdown', async ({ page }) => {
    // Set up with dark theme
    await page.goto('/');
    await page.evaluate(() => {
      const config = {
        _v: '0.0.4',
        settings: { theme: 'glassmorphism-dark', language: 'en' },
        elements: [],
      };
      localStorage.setItem('app_config', JSON.stringify(config));
    });
    await page.reload();

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // The select trigger should show the current theme
    const themeSelect = page.getByTestId('theme-select');
    const selectText = await themeSelect.textContent();

    // Should contain dark theme indicator
    expect(selectText?.toLowerCase()).toContain('dark');
  });
});
