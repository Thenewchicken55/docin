import { test, expect } from '@playwright/test';

test.describe('Docin App', () => {
  test('loads the app with title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Docin');
  });

  test('shows the sidebar with file list', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.sidebar-title')).toHaveText('Docin');
  });

  test('shows the menu bar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.menu-bar')).toBeVisible();
    await expect(page.locator('.menu-bar-logo')).toHaveText('Docin');
  });

  test('shows the status bar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.status-bar')).toBeVisible();
  });

  test('displays starter files in the file explorer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.file-name').first()).toBeVisible();
  });

  test('opens command palette with keyboard shortcut', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+Shift+p');
    await expect(page.locator('[cmdk-input]')).toBeVisible();
  });

  test('can switch editor modes', async ({ page }) => {
    await page.goto('/');
    const editBtn = page.locator('.mode-btn', { hasText: 'Edit' });
    await editBtn.click();
    await expect(editBtn).toHaveClass(/active/);
  });

  test('shows editor empty state when no file selected', async ({ page }) => {
    await page.goto('/');
    // The app should have an editor area
    await expect(page.locator('.editor-pane')).toBeVisible();
  });
});
