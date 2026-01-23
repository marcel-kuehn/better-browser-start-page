import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display language selector in settings', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-trigger').click();

    // Wait for sidebar to open
    const sidebar = page.getByTestId('settings-sidebar');
    await expect(sidebar).toBeVisible();

    // Language selector should be visible
    const languageLabel = page.getByText(/language/i);
    await expect(languageLabel).toBeVisible();

    // Select element should be present
    const languageSelect = page.getByTestId('language-select');
    await expect(languageSelect).toBeVisible();
  });

  test('should switch to German language', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // Click the language select
    const languageSelect = page.getByTestId('language-select');
    await languageSelect.click();

    // Select German option
    const germanOption = page.getByTestId('language-option-de');
    await germanOption.click();

    // Verify language changed in localStorage
    const config = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    expect(config?.settings?.language).toBe('de');

    // UI should update to German - check that settings title changed
    await expect(page.getByText('Einstellungen')).toBeVisible();
  });

  test('should switch back to English language', async ({ page }) => {
    // First set German language
    await page.goto('/');
    await page.evaluate(() => {
      const config = {
        _v: '0.0.4',
        settings: { theme: 'glassmorphism', language: 'de' },
        elements: [],
      };
      localStorage.setItem('app_config', JSON.stringify(config));
    });
    await page.reload();

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // Click the language select
    const languageSelect = page.getByTestId('language-select');
    await languageSelect.click();

    // Select English option
    const englishOption = page.getByTestId('language-option-en');
    await englishOption.click();

    // Verify language changed
    const config = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    expect(config?.settings?.language).toBe('en');

    // UI should update back to English
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('should persist language after page reload', async ({ page }) => {
    await page.goto('/');

    // Open settings and switch to German
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    const languageSelect = page.getByTestId('language-select');
    await languageSelect.click();

    const germanOption = page.getByTestId('language-option-de');
    await germanOption.click();
    await page.waitForTimeout(500);

    // Close settings
    const closeButton = page.getByTestId('settings-close');
    await closeButton.click();

    // Reload the page
    await page.reload();

    // Verify language is still German
    const config = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });
    expect(config?.settings?.language).toBe('de');

    // Open settings again and verify German is still selected
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByText('Einstellungen')).toBeVisible();
  });

  test('should show current language as selected in dropdown', async ({ page }) => {
    // Set up with German language
    await page.goto('/');
    await page.evaluate(() => {
      const config = {
        _v: '0.0.4',
        settings: { theme: 'glassmorphism', language: 'de' },
        elements: [],
      };
      localStorage.setItem('app_config', JSON.stringify(config));
    });
    await page.reload();

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // The select trigger should show the current language
    const languageSelect = page.getByTestId('language-select');
    const selectText = await languageSelect.textContent();

    // Should contain German language name (in German locale it's "Deutsch")
    expect(selectText?.toLowerCase()).toContain('deutsch');
  });

  test('should translate UI elements when language changes', async ({ page }) => {
    await page.goto('/');

    // Open settings
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByTestId('settings-sidebar')).toBeVisible();

    // Verify English labels are visible
    await expect(page.getByText('Theme')).toBeVisible();
    await expect(page.getByTestId('settings-close')).toHaveText('Close');

    // Switch to German
    const languageSelect = page.getByTestId('language-select');
    await languageSelect.click();

    const germanOption = page.getByTestId('language-option-de');
    await germanOption.click();
    await page.waitForTimeout(300);

    // Verify German labels are visible
    await expect(page.getByText('Design')).toBeVisible();
    await expect(page.getByTestId('settings-close')).toHaveText('Schließen');
  });

  test('should default to English when no language is set', async ({ page }) => {
    await page.goto('/');

    // Verify default language in config
    const config = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    expect(config?.settings?.language).toBe('en');

    // Open settings and verify English labels
    await page.getByTestId('settings-trigger').click();
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('should migrate old config and add default language', async ({ page }) => {
    // Set up old config without language field
    await page.goto('/');
    await page.evaluate(() => {
      const oldConfig = {
        _v: '0.0.3',
        settings: { theme: 'glassmorphism', customBackgroundImage: null },
        elements: [],
      };
      localStorage.setItem('app_config', JSON.stringify(oldConfig));
    });
    await page.reload();

    // Verify config was migrated with default language
    const config = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    expect(config?._v).toBe('0.0.4');
    expect(config?.settings?.language).toBe('en');
  });
});
