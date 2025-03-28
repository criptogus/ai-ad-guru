
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
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
    
    // Check for "Forgot password" link
    await expect(page.getByText('Forgot password?')).toBeVisible();
    
    // Check for social login options if present
    const googleButton = page.getByRole('button').filter({ hasText: /Google/i });
    if (await googleButton.count() > 0) {
      await expect(googleButton.first()).toBeVisible();
    }
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Input invalid email and password
    await page.getByTestId('email-input').fill(INVALID_USER.email);
    await page.getByTestId('password-input').fill(INVALID_USER.password);
    
    // Submit the form
    await page.getByTestId('login-button').click();
    
    // Wait for error message - increased timeout for API response
    await page.waitForTimeout(2000);
    
    // Check for error message (could be toast or inline)
    const errorElement = page.locator('.toast-error, [role="alert"], .text-red-500, .text-destructive');
    await expect(errorElement).toBeVisible({ timeout: 5000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // This test requires a valid user in your system
    // Consider creating a test user or using a mock for this test
    
    console.log('Attempting login with:', TEST_USER.email);
    
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
      console.log('Successfully logged in and redirected to dashboard');
    } catch (error) {
      // If redirect doesn't happen, the test will fail
      // Log the current page content for debugging
      console.log('Login redirect failed. Current page content:', await page.content());
      throw error;
    }
  });

  test('should create and use a test account', async ({ page }) => {
    // Find and click the "Create Test Account" button if it exists
    const testAccountButton = page.getByText(/Create Test Account|Try a test account/i);
    
    if (await testAccountButton.isVisible()) {
      console.log('Found "Create Test Account" button, clicking it');
      await testAccountButton.click();
      
      // Wait for redirect to dashboard after test account creation - increased timeout
      await page.waitForURL(/dashboard/, { timeout: 15000 });
      
      // Verify we're on the dashboard
      await expect(page.url()).toContain('/dashboard');
      console.log('Successfully created test account and redirected to dashboard');
    } else {
      console.log('No test account button found, skipping test');
      test.skip();
    }
  });
});
