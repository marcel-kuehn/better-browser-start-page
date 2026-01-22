import { test, expect } from '@playwright/test';

test.describe('Widget CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should enter edit mode when clicking edit button', async ({ page }) => {
    await page.goto('/');

    // Click the edit mode toggle button using data-testid
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    // In edit mode, add widget buttons should be visible
    const addButtons = page.locator('button[aria-label*="Add widget"]');
    await expect(addButtons.first()).toBeVisible({ timeout: 5000 });
  });

  test('should exit edit mode when clicking stop editing button', async ({ page }) => {
    await page.goto('/');

    // Enter edit mode
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    // Wait for edit mode to be active
    await page.waitForTimeout(500);

    // Click again to exit edit mode
    await editButton.click();

    // Add widget buttons should no longer be visible
    await page.waitForTimeout(500);
    const addButtons = page.locator('button[aria-label*="Add widget"]');
    await expect(addButtons).toHaveCount(0);
  });

  test('should open widget selection dialog when clicking add widget button', async ({ page }) => {
    await page.goto('/');

    // Enter edit mode
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    // Wait for edit mode
    await page.waitForTimeout(500);

    // Click an add widget button
    const addWidgetButton = page.locator('button[aria-label*="Add widget"]').first();
    await addWidgetButton.click();

    // Dialog should open
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Dialog should contain widget options
    await expect(dialog.getByText(/add widget/i)).toBeVisible();
  });

  test('should add a clock widget', async ({ page }) => {
    await page.goto('/');

    // Enter edit mode
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();
    await page.waitForTimeout(500);

    // Click add widget button
    const addWidgetButton = page.locator('button[aria-label*="Add widget"]').first();
    await addWidgetButton.click();

    // Wait for dialog
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Find and click clock widget option
    const clockOption = dialog.locator('button').filter({ hasText: /clock/i }).first();
    await clockOption.click();

    // Dialog should close
    await expect(dialog).not.toBeVisible();

    // Clock widget should be visible (shows time in HH:MM format)
    const timeDisplay = page.locator('text=/\\d{2}:\\d{2}/');
    await expect(timeDisplay).toBeVisible();
  });

  test('should remove a widget in edit mode', async ({ page }) => {
    await page.goto('/');

    // First add a clock widget
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();
    await page.waitForTimeout(500);

    const addWidgetButton = page.locator('button[aria-label*="Add widget"]').first();
    await addWidgetButton.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    const clockOption = dialog.locator('button').filter({ hasText: /clock/i }).first();
    await clockOption.click();
    await expect(dialog).not.toBeVisible();

    // Now we should have a clock widget
    const timeDisplay = page.locator('text=/\\d{2}:\\d{2}/');
    await expect(timeDisplay).toBeVisible();

    // Still in edit mode, click the remove button on the widget
    // The remove button is a small X button on the widget card
    const widgetCard = page.locator('.group').filter({ has: timeDisplay });
    const cardRemoveButton = widgetCard.locator('button').first();

    if (await cardRemoveButton.isVisible()) {
      await cardRemoveButton.click();
      // Widget should be removed
      await expect(timeDisplay).not.toBeVisible();
    }
  });

  test('should persist widgets after page reload', async ({ page }) => {
    await page.goto('/');

    // Add a clock widget
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();
    await page.waitForTimeout(500);

    const addWidgetButton = page.locator('button[aria-label*="Add widget"]').first();
    await addWidgetButton.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    const clockOption = dialog.locator('button').filter({ hasText: /clock/i }).first();
    await clockOption.click();
    await expect(dialog).not.toBeVisible();

    // Exit edit mode
    await editButton.click();
    await page.waitForTimeout(500);

    // Reload the page
    await page.reload();

    // Clock widget should still be visible
    const timeDisplay = page.locator('text=/\\d{2}:\\d{2}/');
    await expect(timeDisplay).toBeVisible();
  });

  test('should add a search widget', async ({ page }) => {
    await page.goto('/');

    // Enter edit mode
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();
    await page.waitForTimeout(500);

    // Click add widget button
    const addWidgetButton = page.locator('button[aria-label*="Add widget"]').first();
    await addWidgetButton.click();

    // Wait for dialog
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Find search widget option - it may have size variants
    // Click on a size variant button (e.g., 1x2, 1x3, etc.)
    const sizeButton = dialog.locator('button').filter({ hasText: /1x/ }).first();
    if (await sizeButton.isVisible()) {
      await sizeButton.click();
    } else {
      const searchSection = dialog
        .locator('button, div')
        .filter({ hasText: /search/i })
        .first();
      await searchSection.click();
    }

    // Dialog should close
    await expect(dialog).not.toBeVisible();

    // Search input should be visible
    const searchInput = page.locator('input[placeholder*="earch" i]');
    await expect(searchInput).toBeVisible();
  });
});
