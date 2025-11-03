import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveTitle(/CI\/CD Demo/);
    await expect(page.locator('h1')).toContainText('Welcome Back');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');

    await page.locator('text=Sign up here').click();
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1')).toContainText('Create Account');
  });

  test('should successfully login with admin@example.com', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'admin@example.com');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toContainText('Tasks');
    await expect(page.locator('text=Welcome,')).toBeVisible();
  });

  test('should successfully register new user', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.goto('/register');

    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="username"]', 'Test User');
    await page.fill('input[name="password"]', 'testpassword123');
    await page.fill('input[name="confirmPassword"]', 'testpassword123');

    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toContainText('Tasks');
    await expect(page.locator('text=Welcome, Test User')).toBeVisible();
  });

});
