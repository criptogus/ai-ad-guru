
import { test, expect } from '@playwright/test';

// Test data for login to access billing
const TEST_USER = { email: 'test@example.com', password: 'Password123!' };

test.describe('Billing Functionality', () => {
  // Login before testing billing features
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login');
    
    // Login with test account
    await page.getByTestId('email-input').fill(TEST_USER.email);
    await page.getByTestId('password-input').fill(TEST_USER.password);
    await page.getByTestId('login-button').click();
    
    // Wait for login to complete and redirect
    try {
      await page.waitForURL(/dashboard/, { timeout: 15000 });
    } catch (error) {
      // If login fails, try creating a test account instead
      const testAccountButton = page.getByText(/Create Test Account|Try a test account/i);
      if (await testAccountButton.isVisible()) {
        await testAccountButton.click();
        await page.waitForURL(/dashboard/, { timeout: 15000 });
      } else {
        console.log('Failed to login and no test account option available');
        throw error;
      }
    }
    
    // Navigate to billing page
    await page.goto('/billing');
    
    // Wait for billing page content to load
    await page.waitForSelector('h1,h2', { timeout: 10000 });
  });

  test('should display billing page with subscription options', async ({ page }) => {
    // Check that billing content is visible
    await expect(page.getByText(/AI Ad Guru Pro|Subscription|Credits/i)).toBeVisible();
    
    // Check pricing information is visible
    const pricingElement = page.getByText(/\$\d+(\.\d+)?/i);
    await expect(pricingElement).toBeVisible();
  });

  test('should display credit status for authenticated users', async ({ page }) => {
    // Verify credit information is visible
    const creditElement = page.getByText(/credits|subscription/i, { exact: false });
    await expect(creditElement).toBeVisible();
  });

  test('should show payment button for users without subscription', async ({ page }) => {
    // Look for payment/subscription button
    // This might not be visible if the user already has a subscription
    const paymentButtons = page.getByRole('button').filter({ hasText: /subscribe|upgrade|buy|purchase|activate/i });
    
    // If there's no button, the user might already have a subscription
    if (await paymentButtons.count() > 0) {
      await expect(paymentButtons.first()).toBeVisible();
    } else {
      // Check if user already has a subscription
      const subscriptionStatus = page.getByText(/active subscription|current plan/i);
      if (await subscriptionStatus.count() > 0) {
        await expect(subscriptionStatus.first()).toBeVisible();
        test.skip('User already has a subscription');
      } else {
        // If no subscription and no payment button, something is wrong
        throw new Error('No payment button and no active subscription found');
      }
    }
  });

  test('should allow simulating a payment in test mode', async ({ page }) => {
    // Look for a simulate payment or test payment button
    const simulateButton = page.getByRole('button').filter({ hasText: /simulate|test payment|development/i });
    
    if (await simulateButton.count() > 0) {
      await simulateButton.first().click();
      
      // Wait for success message
      await page.waitForTimeout(2000);
      const successMessage = page.getByText(/success|activated|completed/i);
      await expect(successMessage).toBeVisible({ timeout: 10000 });
    } else {
      // If there's no simulate button, skip this test
      test.skip('No simulation option available');
    }
  });
});
