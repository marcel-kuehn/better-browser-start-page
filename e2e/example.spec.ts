import { test, expect } from '@playwright/test'

test.describe('Better Browser Start Page - Example E2E Tests', () => {
  test('should load the page successfully', async ({ page }) => {
    await page.goto('/')

    // Check that the page title exists or root element is present
    const root = page.locator('#root')
    await expect(root).toBeVisible()
  })
})
