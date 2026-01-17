import { test, expect } from '@playwright/test'

test.describe('Better Browser Start Page - Example E2E Tests', () => {
  test('should load the page successfully', async ({ page }) => {
    await page.goto('/')

    // Check that the page title exists or root element is present
    const root = page.locator('#root')
    await expect(root).toBeVisible()
  })

  test('should display the main application', async ({ page }) => {
    await page.goto('/')

    // Wait for the app to load
    await page.waitForLoadState('networkidle')

    // Check that the root element is visible
    const root = page.locator('#root')
    await expect(root).toBeVisible()
  })

  test('should have proper page structure', async ({ page }) => {
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('domcontentloaded')

    // Verify the root element exists
    const root = page.locator('#root')
    await expect(root).toBeAttached()
  })
})

