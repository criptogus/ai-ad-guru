
# End-to-End Tests for AI Ad Manager

This directory contains end-to-end tests for the application using Playwright.

## Test Files

- `login.spec.ts`: Tests for the login functionality
- `registration.spec.ts`: Tests for the user registration
- `billing.spec.ts`: Tests for billing and subscription

## Setup

Since you cannot modify package.json directly, you need to install Playwright manually:

```bash
npm install -D @playwright/test
npx playwright install
```

## Running Tests

To run the tests:

```bash
npx playwright test
```

Run specific test file:

```bash
npx playwright test tests/login.spec.ts
```

Run in UI mode (for debugging):

```bash
npx playwright test --ui
```

## Configuration

The Playwright configuration is in `playwright.config.ts`. It:

- Runs tests in Chrome, Firefox, and Safari
- Takes screenshots on failure
- Starts the dev server automatically
- Configures appropriate timeouts for stable testing

## Test Data

The tests use:
- Predefined test accounts
- Generated unique emails for registration
- Success and failure scenarios

## Tips

1. For login tests to pass, ensure the test user exists
2. The tests handle both development and production environments
3. Adjust selectors if your UI changes
