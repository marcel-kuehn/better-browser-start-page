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

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const addButton = page.getByTestId('add-widget-button-1-1');
    await expect(addButton).toBeVisible();
  });

  test('should exit edit mode when clicking stop editing button', async ({ page }) => {
    await page.goto('/');

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const addButton = page.getByTestId('add-widget-button-1-1');
    await expect(addButton).toBeVisible();

    await editButton.click();

    await expect(addButton).not.toBeVisible();
  });

  test('should open widget selection dialog when clicking add widget button', async ({ page }) => {
    await page.goto('/');

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const addWidgetButton = page.getByTestId('add-widget-button-1-1');
    await expect(addWidgetButton).toBeVisible();
    await addWidgetButton.click();

    const dialog = page.getByTestId('widget-selection-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/add widget/i)).toBeVisible();
  });

  test('should add a clock widget', async ({ page }) => {
    await page.goto('/');

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const addWidgetButton = page.getByTestId('add-widget-button-1-1');
    await addWidgetButton.click();

    const dialog = page.getByTestId('widget-selection-dialog');
    await expect(dialog).toBeVisible();

    const clockOption = dialog.getByTestId('widget-option-clock-widget-1x1');
    await clockOption.click();

    await expect(dialog).not.toBeVisible();

    const clockWidget = page.getByTestId('widget-clock-widget-1-1');
    await expect(clockWidget).toBeVisible();
    const timeDisplay = clockWidget.getByTestId('clock-time-display');
    await expect(timeDisplay).toBeVisible();
  });

  test('should remove a widget in edit mode', async ({ page }) => {
    await page.goto('/');

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const addWidgetButton = page.getByTestId('add-widget-button-1-1');
    await addWidgetButton.click();

    const dialog = page.getByTestId('widget-selection-dialog');
    await expect(dialog).toBeVisible();

    const clockOption = dialog.getByTestId('widget-option-clock-widget-1x1');
    await clockOption.click();
    await expect(dialog).not.toBeVisible();

    const widgetCard = page.getByTestId('widget-clock-widget-1-1');
    await expect(widgetCard).toBeVisible();

    const removeButton = widgetCard.getByTestId('remove-widget-button');
    await removeButton.click();

    await expect(widgetCard).not.toBeVisible();
  });

  test('should persist widgets after page reload', async ({ page }) => {
    await page.goto('/');

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const addWidgetButton = page.getByTestId('add-widget-button-1-1');
    await addWidgetButton.click();

    const dialog = page.getByTestId('widget-selection-dialog');
    await expect(dialog).toBeVisible();

    const clockOption = dialog.getByTestId('widget-option-clock-widget-1x1');
    await clockOption.click();
    await expect(dialog).not.toBeVisible();

    await editButton.click();

    await page.reload();

    const clockWidget = page.getByTestId('widget-clock-widget-1-1');
    await expect(clockWidget).toBeVisible();
  });

  test('should add a search widget', async ({ page }) => {
    await page.goto('/');

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const addRowButton = page.getByTestId('add-bottom-row');
    await addRowButton.click();

    const addWidgetButton = page.getByTestId('add-widget-button-2-1');
    await addWidgetButton.click();

    const dialog = page.getByTestId('widget-selection-dialog');
    await expect(dialog).toBeVisible();

    const searchButton = dialog.getByTestId('widget-variant-search-widget-1x2');
    await expect(searchButton).not.toBeDisabled();
    await searchButton.click();

    await expect(dialog).not.toBeVisible();

    const searchWidget = page.getByTestId('widget-search-widget-2-1');
    await expect(searchWidget).toBeVisible();
    const searchInput = searchWidget.getByTestId('search-input');
    await expect(searchInput).toBeVisible();
  });
});

test.describe('Widget Copy-Paste Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should copy a widget and paste it in a different location', async ({ page }) => {
    await page.goto('/');

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const addWidgetButton = page.getByTestId('add-widget-button-1-1');
    await addWidgetButton.click();

    const dialog = page.getByTestId('widget-selection-dialog');
    await expect(dialog).toBeVisible();

    const clockOption = dialog.getByTestId('widget-option-clock-widget-1x1');
    await clockOption.click();
    await expect(dialog).not.toBeVisible();

    const clockWidget = page.getByTestId('widget-clock-widget-1-1');
    await expect(clockWidget).toBeVisible();

    const copyButton = clockWidget.getByTestId('copy-widget-button');
    await copyButton.click();

    const addWidgetButton2 = page.getByTestId('add-widget-button-1-4');
    await addWidgetButton2.click();

    const pasteDialog = page.getByTestId('widget-selection-dialog');
    await expect(pasteDialog).toBeVisible();

    const pasteButton = pasteDialog.getByTestId('paste-widget-button');
    await expect(pasteButton).toBeEnabled();
    await pasteButton.click();

    await expect(pasteDialog).not.toBeVisible();

    const clockWidget1 = page.getByTestId('widget-clock-widget-1-1');
    const clockWidget2 = page.getByTestId('widget-clock-widget-1-4');
    await expect(clockWidget1).toBeVisible();
    await expect(clockWidget2).toBeVisible();
  });

  test('should copy a search widget and paste it with all elements preserved', async ({ page }) => {
    await page.goto('/');

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const existingSearchWidget = page.getByTestId('widget-search-widget-1-2');
    const removeButton = existingSearchWidget.getByTestId('remove-widget-button');
    await removeButton.click();
    await expect(existingSearchWidget).not.toBeVisible();

    const addWidgetButton = page.getByTestId('add-widget-button-1-1');
    await expect(addWidgetButton).toBeVisible();
    await addWidgetButton.click();

    const dialog = page.getByTestId('widget-selection-dialog');
    await expect(dialog).toBeVisible();

    const searchButton = dialog.getByTestId('widget-variant-search-widget-1x2');
    await expect(searchButton).toBeEnabled();
    await searchButton.click();
    await expect(dialog).not.toBeVisible();

    const searchWidget = page.getByTestId('widget-search-widget-1-1');
    await expect(searchWidget).toBeVisible();
    const searchInput = searchWidget.getByTestId('search-input');
    await expect(searchInput).toBeVisible();

    const configBefore = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    const gridElementsBefore = configBefore?.elements?.[0]?.elements || [];
    const searchWidgetBefore = gridElementsBefore.find(
      (el: { type: string }) => el.type === 'search-widget'
    );
    expect(searchWidgetBefore).toBeDefined();
    expect(searchWidgetBefore.elements).toBeDefined();
    expect(searchWidgetBefore.elements.length).toBeGreaterThan(0);

    const copyButton = searchWidget.getByTestId('copy-widget-button');
    await copyButton.click();

    const addRightColumnButton2 = page.getByTestId('add-right-column');
    await addRightColumnButton2.click();

    const addWidgetButton2 = page.getByTestId('add-widget-button-1-4');
    await expect(addWidgetButton2).toBeVisible();
    await addWidgetButton2.click();

    const pasteDialog = page.getByTestId('widget-selection-dialog');
    await expect(pasteDialog).toBeVisible();
    await expect(pasteDialog.getByText(/paste from clipboard/i)).toBeVisible();

    const pasteButton = pasteDialog.getByTestId('paste-widget-button');
    await expect(pasteButton).toBeEnabled();
    await pasteButton.click();

    await expect(pasteDialog).not.toBeVisible();

    const searchWidget1 = page.getByTestId('widget-search-widget-1-1');
    const searchWidget2 = page.getByTestId('widget-search-widget-1-4');
    await expect(searchWidget1).toBeVisible();
    await expect(searchWidget2).toBeVisible();

    const configAfter = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    const gridElementsAfter = configAfter?.elements?.[0]?.elements || [];
    const searchWidgets = gridElementsAfter.filter(
      (el: { type: string }) => el.type === 'search-widget'
    );
    expect(searchWidgets).toHaveLength(2);

    searchWidgets.forEach((widget: { elements?: unknown[] }) => {
      expect(widget.elements).toBeDefined();
      expect(widget.elements?.length).toBeGreaterThan(0);
    });

    const originalElements = searchWidgetBefore.elements;
    const pastedWidget = searchWidgets.find((w: { id: string }) => w.id !== searchWidgetBefore.id);
    expect(pastedWidget.elements).toHaveLength(originalElements.length);
  });

  test('should copy a links widget and paste it with all elements and title preserved', async ({
    page,
  }) => {
    await page.goto('/');

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const addWidgetButton = page.getByTestId('add-widget-button-1-1');
    await addWidgetButton.click();

    const dialog = page.getByTestId('widget-selection-dialog');
    await expect(dialog).toBeVisible();

    const linksVariants = ['1x1', '1x2', '1x3', '1x4'];
    let linksButtonClicked = false;
    for (const variant of linksVariants) {
      const linksButton = dialog.getByTestId(`widget-variant-links-widget-${variant}`);
      if ((await linksButton.isVisible()) && !(await linksButton.isDisabled())) {
        await linksButton.click();
        linksButtonClicked = true;
        break;
      }
    }
    if (!linksButtonClicked) {
      const linksOption = dialog.getByTestId('widget-option-links-widget-1x1');
      if (await linksOption.isVisible()) {
        await linksOption.click();
      }
    }
    await expect(dialog).not.toBeVisible();

    const configBefore = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    const gridElementsBefore = configBefore?.elements?.[0]?.elements || [];
    const linksWidgetBefore = gridElementsBefore.find(
      (el: { type: string }) => el.type === 'links-widget'
    );
    expect(linksWidgetBefore).toBeDefined();
    expect(linksWidgetBefore.title).toBeDefined();
    expect(linksWidgetBefore.elements).toBeDefined();

    const widgetTitle = page.getByText(linksWidgetBefore.title);
    await expect(widgetTitle).toBeVisible();

    const linksWidget = page.getByTestId('widget-links-widget-1-1');
    await expect(linksWidget).toBeVisible();

    const copyButton = linksWidget.getByTestId('copy-widget-button');
    await copyButton.click();

    const addRightColumnButton = page.getByTestId('add-right-column');
    await addRightColumnButton.click();

    const addWidgetButton2 = page.getByTestId('add-widget-button-1-5');
    await expect(addWidgetButton2).toBeVisible();
    await addWidgetButton2.click();

    const pasteDialog = page.getByTestId('widget-selection-dialog');
    await expect(pasteDialog).toBeVisible();
    await expect(pasteDialog.getByText(/paste from clipboard/i)).toBeVisible();

    const pasteButton = pasteDialog.getByTestId('paste-widget-button');
    await expect(pasteButton).toBeEnabled();
    await pasteButton.click();

    await expect(pasteDialog).not.toBeVisible();

    const titles = page.getByText(linksWidgetBefore.title);
    await expect(titles).toHaveCount(2);

    const configAfter = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    const gridElementsAfter = configAfter?.elements?.[0]?.elements || [];
    const linksWidgets = gridElementsAfter.filter(
      (el: { type: string }) => el.type === 'links-widget'
    );
    expect(linksWidgets).toHaveLength(2);

    linksWidgets.forEach((widget: { title?: string; elements?: unknown[] }) => {
      expect(widget.title).toBeDefined();
      expect(widget.title).toBe(linksWidgetBefore.title);
      expect(widget.elements).toBeDefined();
    });
  });

  test('should have different IDs for original and pasted widget', async ({ page }) => {
    await page.goto('/');

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const addWidgetButton = page.getByTestId('add-widget-button-1-1');
    await addWidgetButton.click();

    const dialog = page.getByTestId('widget-selection-dialog');
    await expect(dialog).toBeVisible();

    const clockOption = dialog.getByTestId('widget-option-clock-widget-1x1');
    await clockOption.click();
    await expect(dialog).not.toBeVisible();

    const clockWidget = page.getByTestId('widget-clock-widget-1-1');
    await expect(clockWidget).toBeVisible();

    const copyButton = clockWidget.getByTestId('copy-widget-button');
    await copyButton.click();

    const addRightColumnButton = page.getByTestId('add-right-column');
    await expect(addRightColumnButton).toBeVisible();
    await addRightColumnButton.click();

    const addWidgetButton2 = page.getByTestId('add-widget-button-1-5');
    await expect(addWidgetButton2).toBeVisible();
    await addWidgetButton2.click();

    const pasteDialog = page.getByTestId('widget-selection-dialog');
    await expect(pasteDialog).toBeVisible();
    const pasteButton = pasteDialog.getByTestId('paste-widget-button');
    await expect(pasteButton).toBeEnabled();
    await pasteButton.click();

    await expect(pasteDialog).not.toBeVisible();

    const clockWidget1 = page.getByTestId('widget-clock-widget-1-1');
    const clockWidget2 = page.getByTestId('widget-clock-widget-1-5');
    await expect(clockWidget1).toBeVisible();
    await expect(clockWidget2).toBeVisible();

    const configAfter = await page.evaluate(() => {
      const config = localStorage.getItem('app_config');
      return config ? JSON.parse(config) : null;
    });

    const gridElementsAfter = configAfter?.elements?.[0]?.elements || [];
    const clockWidgetConfigs = gridElementsAfter.filter(
      (el: { type: string }) => el.type === 'clock-widget'
    );

    expect(clockWidgetConfigs).toHaveLength(2);
    expect(clockWidgetConfigs[0].id).not.toBe(clockWidgetConfigs[1].id);
  });

  test('should keep clipboard content after deleting original widget', async ({ page }) => {
    await page.goto('/');

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const addWidgetButton = page.getByTestId('add-widget-button-1-1');
    await addWidgetButton.click();

    const dialog = page.getByTestId('widget-selection-dialog');
    await expect(dialog).toBeVisible();

    const clockOption = dialog.getByTestId('widget-option-clock-widget-1x1');
    await clockOption.click();
    await expect(dialog).not.toBeVisible();

    const clockWidget = page.getByTestId('widget-clock-widget-1-1');
    await expect(clockWidget).toBeVisible();

    const copyButton = clockWidget.getByTestId('copy-widget-button');
    await copyButton.click();

    const deleteButton = clockWidget.getByTestId('remove-widget-button');
    await deleteButton.click();

    await expect(clockWidget).not.toBeVisible();

    const addWidgetButton2 = page.getByTestId('add-widget-button-1-1');
    await addWidgetButton2.click();

    const pasteDialog = page.getByTestId('widget-selection-dialog');
    await expect(pasteDialog).toBeVisible();
    await expect(pasteDialog.getByText(/paste from clipboard/i)).toBeVisible();

    const pasteButton = pasteDialog.getByTestId('paste-widget-button');
    await expect(pasteButton).toBeEnabled();
    await pasteButton.click();

    const newClockWidget = page.getByTestId('widget-clock-widget-1-1');
    await expect(newClockWidget).toBeVisible();
  });

  test('should not show paste option when clipboard is empty', async ({ page }) => {
    await page.goto('/');

    const editButton = page.getByTestId('edit-mode-toggle');
    await editButton.click();

    const addWidgetButton = page.getByTestId('add-widget-button-1-1');
    await addWidgetButton.click();

    const dialog = page.getByTestId('widget-selection-dialog');
    await expect(dialog).toBeVisible();

    await expect(dialog.getByText(/paste from clipboard/i)).not.toBeVisible();
    await expect(dialog.getByTestId('paste-widget-button')).not.toBeVisible();
  });
});
