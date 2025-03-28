
import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

// Generate a unique email to avoid conflicts with existing accounts
const generateUniqueEmail = () => `test_${uuidv4().substring(0, 8)}@example.com`;

test.describe('Registration Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the register page before each test
    await page.goto('/register');
    // Wait for the registration form to be visible
    await page.waitForSelector('form');
  });

  test('should display registration form with all elements', async ({ page }) => {
    // Check that all form elements are present
    await expect(page.getByTestId('name-input')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('confirm-password-input')).toBeVisible();
    await expect(page.getByTestId('register-button')).toBeVisible();
  });

  test('should show validation errors for invalid inputs', async ({ page }) => {
    // Submit empty form
    await page.getByTestId('register-button').click();
    
    // Check for validation errors
    const errorMessages = page.locator('.text-red-500');
    await expect(errorMessages).toBeVisible();
  });

  test('should show error for password mismatch', async ({ page }) => {
    // Fill form with mismatched passwords
    await page.getByTestId('name-input').fill('Test User');
    await page.getByTestId('email-input').fill(generateUniqueEmail());
    await page.getByTestId('password-input').fill('Password123!');
    await page.getByTestId('confirm-password-input').fill('DifferentPassword123!');
    
    // Submit the form
    await page.getByTestId('register-button').click();
    
    // Check for password mismatch error
    const errorMessage = page.locator('text=Passwords do not match');
    await expect(errorMessage).toBeVisible();
  });

  test('should register successfully with valid information', async ({ page }) => {
    // Generate unique email for registration
    const uniqueEmail = generateUniqueEmail();
    
    // Fill form with valid information
    await page.getByTestId('name-input').fill('Test User');
    await page.getByTestId('email-input').fill(uniqueEmail);
    await page.getByTestId('password-input').fill('Password123!');
    await page.getByTestId('confirm-password-input').fill('Password123!');
    
    // Submit the form
    await page.getByTestId('register-button').click();
    
    // Wait for redirect to dashboard or verification page
    try {
      await page.waitForURL(/dashboard|verify-email|billing/, { timeout: 15000 });
      
      // Verify we're redirected to the expected page
      const currentUrl = page.url();
      await expect(
        currentUrl.includes('/dashboard') || 
        currentUrl.includes('/verify-email') || 
        currentUrl.includes('/billing')
      ).toBeTruthy();
    } catch (error) {
      console.log('Current page content:', await page.content());
      throw error;
    }
  });
});
