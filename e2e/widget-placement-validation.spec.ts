import { test, expect } from '@playwright/test';

// 4x4 empty grid configuration for testing
const emptyGridConfig = {
  _v: '0.0.2',
  settings: { theme: 'frost' },
  elements: [
    {
      id: 'test-grid-1',
      type: 'grid',
      span: { rowSpan: 4, columnSpan: 4 },
      rows: 4,
      elements: [],
    },
  ],
};

test.describe('Widget Placement Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Set up a 4x4 empty grid for testing
    await page.goto('/');
    await page.evaluate(config => {
      localStorage.setItem('app_config', JSON.stringify(config));
    }, emptyGridConfig);
    await page.reload();

    // Enter edit mode
    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();
    await page.waitForTimeout(500);
  });

  test.describe('Out of Bounds Prevention', () => {
    test('should show alert when adding large widget at bottom-right corner', async ({ page }) => {
      // Handle alert dialog
      let alertMessage = '';
      page.on('dialog', async dialog => {
        alertMessage = dialog.message();
        await dialog.accept();
      });

      // Click add widget button at position (4,4) - bottom-right corner of default 4x4 grid
      const addWidgetButton = page.locator('button[aria-label="Add widget at row 4, column 4"]');
      await expect(addWidgetButton).toBeVisible();
      await addWidgetButton.click();

      // Wait for dialog
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Find Apps widget section (which has larger size variants including 2x2, 4x4, etc.)
      // Click on 2x2 variant - this would extend beyond the 4x4 grid from position (4,4)
      const size2x2Button = dialog.getByRole('button', { name: '2x2' }).first();
      await size2x2Button.click();

      // Should have triggered an alert about not enough space
      await page.waitForTimeout(500);
      expect(alertMessage).toBeTruthy();
    });

    test('should show alert when adding 4x4 widget at position (2,2)', async ({ page }) => {
      // Handle alert dialog
      let alertMessage = '';
      page.on('dialog', async dialog => {
        alertMessage = dialog.message();
        await dialog.accept();
      });

      // Click add widget button at position (2,2)
      const addWidgetButton = page.locator('button[aria-label="Add widget at row 2, column 2"]');
      await expect(addWidgetButton).toBeVisible();
      await addWidgetButton.click();

      // Wait for dialog
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Try to add 4x4 Apps widget - would extend to (6,6), way beyond 4x4 grid
      const size4x4Button = dialog.getByRole('button', { name: '4x4' }).first();
      await size4x4Button.click();

      // Should have triggered an alert
      await page.waitForTimeout(500);
      expect(alertMessage).toBeTruthy();
    });

    test('should allow 1x1 widget at any position including bottom-right corner', async ({
      page,
    }) => {
      // Handle alert dialog
      let alertTriggered = false;
      page.on('dialog', async dialog => {
        alertTriggered = true;
        await dialog.accept();
      });

      // Click add widget button at position (4,4)
      const addWidgetButton = page.locator('button[aria-label="Add widget at row 4, column 4"]');
      await addWidgetButton.click();

      // Wait for dialog
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Click on Clock widget (which is 1x1)
      const clockOption = dialog.locator('button').filter({ hasText: /clock/i }).first();
      await clockOption.click();

      // Dialog should close without alert
      await expect(dialog).not.toBeVisible();
      expect(alertTriggered).toBe(false);

      // Clock widget should be visible
      const timeDisplay = page.locator('text=/\\d{2}:\\d{2}/');
      await expect(timeDisplay).toBeVisible();
    });

    test('should allow 2x2 widget at position (3,3) on 4x4 grid (exactly fits)', async ({
      page,
    }) => {
      // Handle alert dialog
      let alertTriggered = false;
      page.on('dialog', async dialog => {
        alertTriggered = true;
        await dialog.accept();
      });

      // Click add widget button at position (3,3)
      const addWidgetButton = page.locator('button[aria-label="Add widget at row 3, column 3"]');
      await addWidgetButton.click();

      // Wait for dialog
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Click on 2x2 Apps widget - should fit exactly (extends to 5,5 which is valid for 4x4 grid)
      const size2x2Button = dialog.getByRole('button', { name: '2x2' }).first();
      await size2x2Button.click();

      // Should succeed without alert
      await expect(dialog).not.toBeVisible();
      expect(alertTriggered).toBe(false);
    });
  });

  test.describe('Collision Prevention', () => {
    test('should show alert when adding widget that would overlap existing widget', async ({
      page,
    }) => {
      // First, add a 2x2 widget at position (2,2)
      const addWidgetAt2x2 = page.locator('button[aria-label="Add widget at row 2, column 2"]');
      await addWidgetAt2x2.click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Add 2x2 Apps widget
      const size2x2Button = dialog.getByRole('button', { name: '2x2' }).first();
      await size2x2Button.click();
      await expect(dialog).not.toBeVisible();

      // Wait for widget to be added
      await page.waitForTimeout(500);

      // Now try to add another widget at position (1,1) with size 2x2
      // This would overlap with the existing widget at (2,2)
      let alertMessage = '';
      page.on('dialog', async dlg => {
        alertMessage = dlg.message();
        await dlg.accept();
      });

      const addWidgetAt1x1 = page.locator('button[aria-label="Add widget at row 1, column 1"]');
      await addWidgetAt1x1.click();

      await expect(dialog).toBeVisible();

      // Try to add 2x2 widget - would overlap with existing widget
      const size2x2Button2 = dialog.getByRole('button', { name: '2x2' }).first();
      await size2x2Button2.click();

      // Should show alert
      await page.waitForTimeout(500);
      expect(alertMessage).toBeTruthy();
    });

    test('should allow widget adjacent to existing widget without overlap', async ({ page }) => {
      // First, add a 1x1 widget at position (1,1)
      const addWidgetAt1x1 = page.locator('button[aria-label="Add widget at row 1, column 1"]');
      await addWidgetAt1x1.click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Add Clock widget (1x1)
      const clockOption = dialog.locator('button').filter({ hasText: /clock/i }).first();
      await clockOption.click();
      await expect(dialog).not.toBeVisible();

      // Wait for widget to be added
      await page.waitForTimeout(500);

      // Now add another widget at position (1,2) - adjacent but not overlapping
      let alertTriggered = false;
      page.on('dialog', async dlg => {
        alertTriggered = true;
        await dlg.accept();
      });

      const addWidgetAt1x2 = page.locator('button[aria-label="Add widget at row 1, column 2"]');
      await addWidgetAt1x2.click();

      await expect(dialog).toBeVisible();

      // Add Stopwatch widget (1x1)
      const stopwatchOption = dialog
        .locator('button')
        .filter({ hasText: /stopwatch/i })
        .first();
      await stopwatchOption.click();

      // Should succeed without alert
      await expect(dialog).not.toBeVisible();
      expect(alertTriggered).toBe(false);
    });
  });

  test.describe('AddWidgetButton Visibility', () => {
    test('should not show add widget button for cells occupied by widget', async ({ page }) => {
      // Initially all cells should have add widget buttons
      const initialAddButtons = page.locator('button[aria-label*="Add widget at row"]');
      await expect(initialAddButtons).toHaveCount(16); // 4x4 grid = 16 cells

      // Add a 2x2 widget at position (1,1)
      const addWidgetAt1x1 = page.locator('button[aria-label="Add widget at row 1, column 1"]');
      await addWidgetAt1x1.click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Add 2x2 Apps widget
      const size2x2Button = dialog.getByRole('button', { name: '2x2' }).first();
      await size2x2Button.click();
      await expect(dialog).not.toBeVisible();

      // Wait for widget to be added
      await page.waitForTimeout(500);

      // Now should have 16 - 4 = 12 add widget buttons (2x2 widget occupies 4 cells)
      const remainingAddButtons = page.locator('button[aria-label*="Add widget at row"]');
      await expect(remainingAddButtons).toHaveCount(12);

      // Specific cells occupied by 2x2 widget should not have add buttons
      await expect(page.locator('button[aria-label="Add widget at row 1, column 1"]')).toHaveCount(
        0
      );
      await expect(page.locator('button[aria-label="Add widget at row 1, column 2"]')).toHaveCount(
        0
      );
      await expect(page.locator('button[aria-label="Add widget at row 2, column 1"]')).toHaveCount(
        0
      );
      await expect(page.locator('button[aria-label="Add widget at row 2, column 2"]')).toHaveCount(
        0
      );
    });

    test('should show add widget button for empty cells only', async ({ page }) => {
      // Add multiple widgets at different positions
      // First widget at (1,1)
      await page.locator('button[aria-label="Add widget at row 1, column 1"]').click();
      let dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('button').filter({ hasText: /clock/i }).first().click();
      await expect(dialog).not.toBeVisible();
      await page.waitForTimeout(300);

      // Second widget at (1,3)
      await page.locator('button[aria-label="Add widget at row 1, column 3"]').click();
      dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('button').filter({ hasText: /clock/i }).first().click();
      await expect(dialog).not.toBeVisible();
      await page.waitForTimeout(300);

      // Third widget at (3,1)
      await page.locator('button[aria-label="Add widget at row 3, column 1"]').click();
      dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('button').filter({ hasText: /clock/i }).first().click();
      await expect(dialog).not.toBeVisible();
      await page.waitForTimeout(300);

      // Should have 16 - 3 = 13 add widget buttons
      const addButtons = page.locator('button[aria-label*="Add widget at row"]');
      await expect(addButtons).toHaveCount(13);

      // Occupied cells should not have add buttons
      await expect(page.locator('button[aria-label="Add widget at row 1, column 1"]')).toHaveCount(
        0
      );
      await expect(page.locator('button[aria-label="Add widget at row 1, column 3"]')).toHaveCount(
        0
      );
      await expect(page.locator('button[aria-label="Add widget at row 3, column 1"]')).toHaveCount(
        0
      );

      // Empty cells should still have add buttons
      await expect(page.locator('button[aria-label="Add widget at row 1, column 2"]')).toHaveCount(
        1
      );
      await expect(page.locator('button[aria-label="Add widget at row 4, column 4"]')).toHaveCount(
        1
      );
    });
  });

  test.describe('Edge Cases', () => {
    test('should prevent adding large widget when small widget blocks it', async ({ page }) => {
      // Add a small 1x1 widget at position (3,3)
      const addWidgetAt3x3 = page.locator('button[aria-label="Add widget at row 3, column 3"]');
      await addWidgetAt3x3.click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Add Clock widget (1x1)
      const clockOption = dialog.locator('button').filter({ hasText: /clock/i }).first();
      await clockOption.click();
      await expect(dialog).not.toBeVisible();
      await page.waitForTimeout(500);

      // Now try to add 3x3 widget at position (2,2) - would overlap with clock at (3,3)
      let alertMessage = '';
      page.on('dialog', async dlg => {
        alertMessage = dlg.message();
        await dlg.accept();
      });

      const addWidgetAt2x2 = page.locator('button[aria-label="Add widget at row 2, column 2"]');
      await addWidgetAt2x2.click();

      await expect(dialog).toBeVisible();

      // Try to add 3x3 Apps widget
      const size3x3Button = dialog.getByRole('button', { name: '3x3' }).first();
      await size3x3Button.click();

      // Should show alert
      await page.waitForTimeout(500);
      expect(alertMessage).toBeTruthy();
    });

    test('should allow filling remaining space after existing widget', async ({ page }) => {
      // Add a 2x2 widget at position (1,1)
      const addWidgetAt1x1 = page.locator('button[aria-label="Add widget at row 1, column 1"]');
      await addWidgetAt1x1.click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Add 2x2 Apps widget
      const size2x2Button = dialog.getByRole('button', { name: '2x2' }).first();
      await size2x2Button.click();
      await expect(dialog).not.toBeVisible();
      await page.waitForTimeout(500);

      // Now add another 2x2 widget at position (3,3) - should fit perfectly
      let alertTriggered = false;
      page.on('dialog', async dlg => {
        alertTriggered = true;
        await dlg.accept();
      });

      const addWidgetAt3x3 = page.locator('button[aria-label="Add widget at row 3, column 3"]');
      await addWidgetAt3x3.click();

      await expect(dialog).toBeVisible();

      // Add another 2x2 widget
      const size2x2Button2 = dialog.getByRole('button', { name: '2x2' }).first();
      await size2x2Button2.click();

      // Should succeed
      await expect(dialog).not.toBeVisible();
      expect(alertTriggered).toBe(false);
    });
  });
});
