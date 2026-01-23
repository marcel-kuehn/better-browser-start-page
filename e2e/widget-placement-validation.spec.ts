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
    test('should disable large widget buttons at bottom-right corner', async ({ page }) => {
      // Click add widget button at position (4,4) - bottom-right corner of default 4x4 grid
      const addWidgetButton = page.locator('button[aria-label="Add widget at row 4, column 4"]');
      await expect(addWidgetButton).toBeVisible();
      await addWidgetButton.click();

      // Wait for dialog
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Find Apps widget section (which has larger size variants including 2x2, 4x4, etc.)
      // 2x2 variant should be disabled - this would extend beyond the 4x4 grid from position (4,4)
      const size2x2Button = dialog.getByRole('button', { name: '2x2' }).first();
      await expect(size2x2Button).toBeDisabled();

      // 1x1 should still be enabled
      const size1x1Button = dialog.getByRole('button', { name: '1x1' }).first();
      await expect(size1x1Button).not.toBeDisabled();
    });

    test('should disable 4x4 widget button at position (2,2)', async ({ page }) => {
      // Click add widget button at position (2,2)
      const addWidgetButton = page.locator('button[aria-label="Add widget at row 2, column 2"]');
      await expect(addWidgetButton).toBeVisible();
      await addWidgetButton.click();

      // Wait for dialog
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // 4x4 Apps widget should be disabled - would extend to (6,6), way beyond 4x4 grid
      const size4x4Button = dialog.getByRole('button', { name: '4x4' }).first();
      await expect(size4x4Button).toBeDisabled();

      // 3x3 should be enabled - extends to (5,5) which is valid for 4-row/4-column grid
      const size3x3Button = dialog.getByRole('button', { name: '3x3' }).first();
      await expect(size3x3Button).not.toBeDisabled();

      // 2x2 should be enabled at (2,2) - extends to (4,4)
      const size2x2Button = dialog.getByRole('button', { name: '2x2' }).first();
      await expect(size2x2Button).not.toBeDisabled();
    });

    test('should allow 1x1 widget at any position including bottom-right corner', async ({
      page,
    }) => {
      // Click add widget button at position (4,4)
      const addWidgetButton = page.locator('button[aria-label="Add widget at row 4, column 4"]');
      await addWidgetButton.click();

      // Wait for dialog
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // Clock widget (1x1) should be enabled
      const clockOption = dialog.locator('button').filter({ hasText: /clock/i }).first();
      await expect(clockOption).not.toBeDisabled();

      // Click on Clock widget
      await clockOption.click();

      // Dialog should close
      await expect(dialog).not.toBeVisible();

      // Clock widget should be visible
      const timeDisplay = page.locator('text=/\\d{2}:\\d{2}/');
      await expect(timeDisplay).toBeVisible();
    });

    test('should enable 2x2 widget at position (3,3) on 4x4 grid (exactly fits)', async ({
      page,
    }) => {
      // Click add widget button at position (3,3)
      const addWidgetButton = page.locator('button[aria-label="Add widget at row 3, column 3"]');
      await addWidgetButton.click();

      // Wait for dialog
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // 2x2 Apps widget should be enabled - should fit exactly (extends to 5,5 which is valid for 4x4 grid)
      const size2x2Button = dialog.getByRole('button', { name: '2x2' }).first();
      await expect(size2x2Button).not.toBeDisabled();

      // Click on 2x2 variant
      await size2x2Button.click();

      // Should succeed
      await expect(dialog).not.toBeVisible();
    });
  });

  test.describe('Collision Prevention', () => {
    test('should disable widget button that would overlap existing widget', async ({ page }) => {
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

      // Now try to add another widget at position (1,1)
      const addWidgetAt1x1 = page.locator('button[aria-label="Add widget at row 1, column 1"]');
      await addWidgetAt1x1.click();

      await expect(dialog).toBeVisible();

      // 2x2 widget button should be disabled - would overlap with existing widget at (2,2)
      const size2x2Button2 = dialog.getByRole('button', { name: '2x2' }).first();
      await expect(size2x2Button2).toBeDisabled();

      // 1x1 should still be enabled
      const size1x1Button = dialog.getByRole('button', { name: '1x1' }).first();
      await expect(size1x1Button).not.toBeDisabled();
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
      const addWidgetAt1x2 = page.locator('button[aria-label="Add widget at row 1, column 2"]');
      await addWidgetAt1x2.click();

      await expect(dialog).toBeVisible();

      // Stopwatch widget (1x1) should be enabled - adjacent but not overlapping
      const stopwatchOption = dialog
        .locator('button')
        .filter({ hasText: /stopwatch/i })
        .first();
      await expect(stopwatchOption).not.toBeDisabled();

      await stopwatchOption.click();

      // Should succeed
      await expect(dialog).not.toBeVisible();
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
    test('should disable large widget button when small widget blocks it', async ({ page }) => {
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

      // Now try to add widget at position (2,2)
      const addWidgetAt2x2 = page.locator('button[aria-label="Add widget at row 2, column 2"]');
      await addWidgetAt2x2.click();

      await expect(dialog).toBeVisible();

      // 3x3 Apps widget should be disabled - would overlap with clock at (3,3)
      const size3x3Button = dialog.getByRole('button', { name: '3x3' }).first();
      await expect(size3x3Button).toBeDisabled();

      // 2x2 should also be disabled - would overlap with clock at (3,3)
      const size2x2Button = dialog.getByRole('button', { name: '2x2' }).first();
      await expect(size2x2Button).toBeDisabled();

      // 1x1 should still be enabled
      const size1x1Button = dialog.getByRole('button', { name: '1x1' }).first();
      await expect(size1x1Button).not.toBeDisabled();
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
      const addWidgetAt3x3 = page.locator('button[aria-label="Add widget at row 3, column 3"]');
      await addWidgetAt3x3.click();

      await expect(dialog).toBeVisible();

      // 2x2 button should be enabled - fits at (3,3) without collision or out-of-bounds
      const size2x2Button2 = dialog.getByRole('button', { name: '2x2' }).first();
      await expect(size2x2Button2).not.toBeDisabled();

      // Add another 2x2 widget
      await size2x2Button2.click();

      // Should succeed
      await expect(dialog).not.toBeVisible();
    });
  });

  test.describe('Disabled Button Visual Appearance', () => {
    test('should show disabled buttons as visible but not clickable', async ({ page }) => {
      // Click add widget button at position (4,4)
      const addWidgetButton = page.locator('button[aria-label="Add widget at row 4, column 4"]');
      await addWidgetButton.click();

      // Wait for dialog
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      // 2x2 variant should be visible but disabled
      const size2x2Button = dialog.getByRole('button', { name: '2x2' }).first();
      await expect(size2x2Button).toBeVisible();
      await expect(size2x2Button).toBeDisabled();

      // Verify it has reduced opacity (disabled styling)
      const opacity = await size2x2Button.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.opacity;
      });
      expect(parseFloat(opacity)).toBeLessThan(1);
    });
  });

  test.describe('Paste Button Validation', () => {
    test('should disable paste button when pasted widget would go out of bounds', async ({
      page,
    }) => {
      // First, add a 2x2 Apps widget at position (1,1) and copy it
      const addWidgetAt1x1 = page.getByTestId('add-widget-button-1-1');
      await addWidgetAt1x1.click();

      const dialog = page.getByTestId('widget-selection-dialog');
      await expect(dialog).toBeVisible();

      // Add 2x2 Apps widget
      const size2x2Button = dialog.getByRole('button', { name: '2x2' }).first();
      await size2x2Button.click();
      await expect(dialog).not.toBeVisible();

      // Wait for widget to be added
      await page.waitForTimeout(500);

      // Copy the 2x2 widget
      const appsWidget = page.getByTestId('widget-apps-widget-1-1');
      await expect(appsWidget).toBeVisible();

      const copyButton = appsWidget.getByTestId('copy-widget-button');
      await copyButton.click();

      // Try to paste at position (4,4) - bottom-right corner
      // A 2x2 widget at (4,4) would extend to (6,6), which is out of bounds for a 4x4 grid
      const addWidgetAt4x4 = page.getByTestId('add-widget-button-4-4');
      await addWidgetAt4x4.click();

      const pasteDialog = page.getByTestId('widget-selection-dialog');
      await expect(pasteDialog).toBeVisible();
      await expect(pasteDialog.getByText(/paste from clipboard/i)).toBeVisible();

      // Paste button should be disabled - would go out of bounds
      const pasteButton = pasteDialog.getByTestId('paste-widget-button');
      await expect(pasteButton).toBeDisabled();
    });

    test('should disable paste button when pasted widget would collide with existing widget', async ({
      page,
    }) => {
      // First, add a 2x2 Apps widget at position (2,2)
      const addWidgetAt2x2 = page.getByTestId('add-widget-button-2-2');
      await addWidgetAt2x2.click();

      const dialog = page.getByTestId('widget-selection-dialog');
      await expect(dialog).toBeVisible();

      // Add 2x2 Apps widget
      const size2x2Button = dialog.getByRole('button', { name: '2x2' }).first();
      await size2x2Button.click();
      await expect(dialog).not.toBeVisible();

      // Wait for widget to be added
      await page.waitForTimeout(500);

      // Copy the 2x2 widget
      const appsWidget = page.getByTestId('widget-apps-widget-2-2');
      await expect(appsWidget).toBeVisible();

      const copyButton = appsWidget.getByTestId('copy-widget-button');
      await copyButton.click();

      // Try to paste at position (1,1)
      // A 2x2 widget at (1,1) would extend to (3,3), which would overlap with the existing widget at (2,2)
      const addWidgetAt1x1 = page.getByTestId('add-widget-button-1-1');
      await addWidgetAt1x1.click();

      const pasteDialog = page.getByTestId('widget-selection-dialog');
      await expect(pasteDialog).toBeVisible();
      await expect(pasteDialog.getByText(/paste from clipboard/i)).toBeVisible();

      // Paste button should be disabled - would collide with existing widget
      const pasteButton = pasteDialog.getByTestId('paste-widget-button');
      await expect(pasteButton).toBeDisabled();
    });

    test('should enable paste button when pasted widget fits without collision or out-of-bounds', async ({
      page,
    }) => {
      // First, add a 1x1 Clock widget at position (1,1) and copy it
      const addWidgetAt1x1 = page.getByTestId('add-widget-button-1-1');
      await addWidgetAt1x1.click();

      const dialog = page.getByTestId('widget-selection-dialog');
      await expect(dialog).toBeVisible();

      // Add Clock widget (1x1)
      const clockOption = dialog.getByTestId('widget-option-clock-widget-1x1');
      await clockOption.click();
      await expect(dialog).not.toBeVisible();

      // Wait for widget to be added
      await page.waitForTimeout(500);

      // Copy the clock widget
      const clockWidget = page.getByTestId('widget-clock-widget-1-1');
      await expect(clockWidget).toBeVisible();

      const copyButton = clockWidget.getByTestId('copy-widget-button');
      await copyButton.click();

      // Try to paste at position (1,2) - adjacent but not overlapping
      // A 1x1 widget at (1,2) doesn't collide with the widget at (1,1) and fits within bounds
      const addWidgetAt1x2 = page.getByTestId('add-widget-button-1-2');
      await addWidgetAt1x2.click();

      const pasteDialog = page.getByTestId('widget-selection-dialog');
      await expect(pasteDialog).toBeVisible();
      await expect(pasteDialog.getByText(/paste from clipboard/i)).toBeVisible();

      // Paste button should be enabled - fits without collision or out-of-bounds
      const pasteButton = pasteDialog.getByTestId('paste-widget-button');
      await expect(pasteButton).toBeEnabled();
    });

    test('should enable paste button for 1x1 widget at any valid position', async ({ page }) => {
      // First, add a Clock widget (1x1) at position (1,1) and copy it
      const addWidgetAt1x1 = page.getByTestId('add-widget-button-1-1');
      await addWidgetAt1x1.click();

      const dialog = page.getByTestId('widget-selection-dialog');
      await expect(dialog).toBeVisible();

      // Add Clock widget (1x1)
      const clockOption = dialog.getByTestId('widget-option-clock-widget-1x1');
      await clockOption.click();
      await expect(dialog).not.toBeVisible();

      // Wait for widget to be added
      await page.waitForTimeout(500);

      // Copy the clock widget
      const clockWidget = page.getByTestId('widget-clock-widget-1-1');
      await expect(clockWidget).toBeVisible();

      const copyButton = clockWidget.getByTestId('copy-widget-button');
      await copyButton.click();

      // Try to paste at position (4,4) - bottom-right corner
      // A 1x1 widget should fit anywhere
      const addWidgetAt4x4 = page.getByTestId('add-widget-button-4-4');
      await addWidgetAt4x4.click();

      const pasteDialog = page.getByTestId('widget-selection-dialog');
      await expect(pasteDialog).toBeVisible();
      await expect(pasteDialog.getByText(/paste from clipboard/i)).toBeVisible();

      // Paste button should be enabled - 1x1 fits anywhere
      const pasteButton = pasteDialog.getByTestId('paste-widget-button');
      await expect(pasteButton).toBeEnabled();
    });
  });
});
