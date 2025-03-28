
import { test, expect } from '@playwright/test';

// Test data for login
const TEST_USER = { email: 'test@example.com', password: 'Password123!' };
const INVALID_USER = { email: 'wrong@example.com', password: 'WrongPass123!' };

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/auth/login');
    // Wait for the login form to be visible
    await page.waitForSelector('form');
  });

  test('should display login form with all elements', async ({ page }) => {
    // Check that all form elements are present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="button"]')).toBeVisible({ timeout: 2000 });
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
    await expect(page.getByText('Forgot password?')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Input invalid email and password
    await page.getByTestId('email-input').fill(INVALID_USER.email);
    await page.getByTestId('password-input').fill(INVALID_USER.password);
    
    // Submit the form
    await page.getByTestId('login-button').click();
    
    // Wait for error message
    await page.waitForTimeout(1000); // Give time for the error to appear
    
    // Check for error message (the exact message depends on your implementation)
    const errorToast = page.locator('.toast-error, [role="alert"]');
    await expect(errorToast).toBeVisible({ timeout: 5000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // This test requires a valid user in your system
    // Consider creating a test user or using a mock for this test
    
    // Input valid email and password
    await page.getByTestId('email-input').fill(TEST_USER.email);
    await page.getByTestId('password-input').fill(TEST_USER.password);
    
    // Submit the form
    await page.getByTestId('login-button').click();
    
    // Wait for redirect to dashboard
    try {
      await page.waitForURL(/dashboard/, { timeout: 10000 });
      
      // Check we landed on the dashboard
      await expect(page.url()).toContain('/dashboard');
    } catch (error) {
      // If redirect doesn't happen, the test will fail
      // Log the current page content for debugging
      console.log('Current page content:', await page.content());
      throw error;
    }
  });

  test('should create and use a test account', async ({ page }) => {
    // Find and click the "Create Test Account" button if it exists
    const testAccountButton = page.getByText(/Create Test Account|Try a test account/i);
    
    if (await testAccountButton.isVisible()) {
      await testAccountButton.click();
      
      // Wait for redirect to dashboard after test account creation
      await page.waitForURL(/dashboard/, { timeout: 15000 });
      
      // Verify we're on the dashboard
      await expect(page.url()).toContain('/dashboard');
    } else {
      test.skip();
    }
  });
});
