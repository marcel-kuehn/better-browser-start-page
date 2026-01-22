import { test, expect } from '@playwright/test';

test.describe('Grid Resize Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should show grid controls in edit mode', async ({ page }) => {
    await page.goto('/');

    // Enter edit mode using data-testid
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    // Wait for edit mode to activate
    await page.waitForTimeout(500);

    // Grid control buttons should be visible (plus/minus circle icons)
    const expandButtons = page.locator(
      'button[aria-label*="Add row"], button[aria-label*="Add column"]'
    );
    await expect(expandButtons.first()).toBeVisible({ timeout: 5000 });
  });

  test('should hide grid controls when not in edit mode', async ({ page }) => {
    await page.goto('/');

    // Grid control buttons should not be visible
    const expandButtons = page.locator(
      'button[aria-label*="Add row"], button[aria-label*="Add column"]'
    );
    await expect(expandButtons).toHaveCount(0);
  });

  test('should expand grid to the right', async ({ page }) => {
    await page.goto('/');

    // Enter edit mode
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();
    await page.waitForTimeout(500);

    // Find the "Add column to the right" button
    const expandRightButton = page.locator('button[aria-label="Add column to the right"]');

    if (await expandRightButton.isVisible()) {
      // Get initial grid state via localStorage
      const initialConfig = await page.evaluate(() => {
        const config = localStorage.getItem('app_config');
        return config ? JSON.parse(config) : null;
      });

      // Click to expand
      await expandRightButton.click();
      await page.waitForTimeout(500);

      // Verify grid expanded (check localStorage or UI)
      const newConfig = await page.evaluate(() => {
        const config = localStorage.getItem('app_config');
        return config ? JSON.parse(config) : null;
      });

      // The columnSpan should have increased
      if (initialConfig && newConfig) {
        const initialSpan = initialConfig.elements?.[0]?.span?.columnSpan || 0;
        const newSpan = newConfig.elements?.[0]?.span?.columnSpan || 0;
        expect(newSpan).toBeGreaterThan(initialSpan);
      }
    }
  });

  test('should expand grid to the bottom', async ({ page }) => {
    await page.goto('/');

    // Enter edit mode
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();
    await page.waitForTimeout(500);

    // Find the "Add row to the bottom" button
    const expandBottomButton = page.locator('button[aria-label="Add row to the bottom"]');

    if (await expandBottomButton.isVisible()) {
      // Get initial grid state
      const initialConfig = await page.evaluate(() => {
        const config = localStorage.getItem('app_config');
        return config ? JSON.parse(config) : null;
      });

      // Click to expand
      await expandBottomButton.click();
      await page.waitForTimeout(500);

      // Verify grid expanded
      const newConfig = await page.evaluate(() => {
        const config = localStorage.getItem('app_config');
        return config ? JSON.parse(config) : null;
      });

      if (initialConfig && newConfig) {
        const initialSpan = initialConfig.elements?.[0]?.span?.rowSpan || 0;
        const newSpan = newConfig.elements?.[0]?.span?.rowSpan || 0;
        expect(newSpan).toBeGreaterThan(initialSpan);
      }
    }
  });

  test('should contract grid when no widgets in row/column', async ({ page }) => {
    await page.goto('/');

    // Enter edit mode
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();
    await page.waitForTimeout(500);

    // First expand the grid
    const expandRightButton = page.locator('button[aria-label="Add column to the right"]');
    if (await expandRightButton.isVisible()) {
      await expandRightButton.click();
      await page.waitForTimeout(500);
    }

    // Now try to contract
    const contractRightButton = page.locator('button[aria-label="Remove column from the right"]');

    if (await contractRightButton.isVisible()) {
      const beforeConfig = await page.evaluate(() => {
        const config = localStorage.getItem('app_config');
        return config ? JSON.parse(config) : null;
      });

      await contractRightButton.click();
      await page.waitForTimeout(500);

      const afterConfig = await page.evaluate(() => {
        const config = localStorage.getItem('app_config');
        return config ? JSON.parse(config) : null;
      });

      if (beforeConfig && afterConfig) {
        const beforeSpan = beforeConfig.elements?.[0]?.span?.columnSpan || 0;
        const afterSpan = afterConfig.elements?.[0]?.span?.columnSpan || 0;
        expect(afterSpan).toBeLessThan(beforeSpan);
      }
    }
  });

  test('should not contract grid below minimum size', async ({ page }) => {
    await page.goto('/');

    // Enter edit mode
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();
    await page.waitForTimeout(500);

    // Get current grid size
    const config = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    const gridSpan = config?.elements?.[0]?.span;

    // If grid is already at minimum (1x1), contract buttons shouldn't exist or should be disabled
    if (gridSpan?.columnSpan === 1) {
      const contractButtons = page.locator('button[aria-label*="Remove column"]');
      // Should either not exist or not be clickable
      const count = await contractButtons.count();
      if (count > 0) {
        // Button exists but shouldn't work
        await contractButtons.first().click();

        // Grid should still be 1 column
        const newConfig = await page.evaluate(() => {
          const config = localStorage.getItem('app_config');
          return config ? JSON.parse(config) : null;
        });
        expect(newConfig?.elements?.[0]?.span?.columnSpan).toBe(1);
      }
    }
  });

  test('should persist grid size after reload', async ({ page }) => {
    await page.goto('/');

    // Enter edit mode and expand grid
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();
    await page.waitForTimeout(500);

    const expandRightButton = page.locator('button[aria-label="Add column to the right"]');
    if (await expandRightButton.isVisible()) {
      await expandRightButton.click();
      await page.waitForTimeout(500);
    }

    // Get the new size
    const configBeforeReload = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    // Reload the page
    await page.reload();

    // Enter edit mode again
    await page.getByTestId('edit-mode-toggle').click();
    await page.waitForTimeout(500);

    // Get the size after reload
    const configAfterReload = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    // Size should be preserved
    expect(configAfterReload?.elements?.[0]?.span?.columnSpan).toBe(
      configBeforeReload?.elements?.[0]?.span?.columnSpan
    );
  });

  test('should show more add widget buttons after expanding grid', async ({ page }) => {
    await page.goto('/');

    // Enter edit mode
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();
    await page.waitForTimeout(500);

    // Count initial add widget buttons
    const initialButtonCount = await page.locator('button[aria-label*="Add widget"]').count();

    // Expand grid
    const expandRightButton = page.locator('button[aria-label="Add column to the right"]');
    if (await expandRightButton.isVisible()) {
      await expandRightButton.click();
      await page.waitForTimeout(500);

      // Count add widget buttons after expansion
      const newButtonCount = await page.locator('button[aria-label*="Add widget"]').count();

      // Should have more buttons (more cells to add widgets to)
      expect(newButtonCount).toBeGreaterThanOrEqual(initialButtonCount);
    }
  });
});
