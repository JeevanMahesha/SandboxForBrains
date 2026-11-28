import type { Page } from '@playwright/test';
import { ADMIN_USER } from './support/emulator';
import { expect, profilesTotal, test } from './support/fixtures';

const submitLogin = async (page: Page) => {
  await page.locator('#login-email').fill(ADMIN_USER.email);
  await page.locator('#login-password').fill(ADMIN_USER.password);
  await page.getByRole('button', { name: 'Login' }).click();
};

test.describe('authentication', () => {
  test('redirects an anonymous visitor to the login page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/login\?returnUrl=%2F$/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('returns to the page the visitor originally asked for after logging in', async ({
    page,
  }) => {
    await page.goto('/profiles/new');
    await expect(page).toHaveURL(/\/login\?returnUrl=%2Fprofiles%2Fnew$/);

    await submitLogin(page);

    await expect(page).toHaveURL(/\/profiles\/new$/);
  });

  test('ignores a returnUrl that points outside the app', async ({ page }) => {
    for (const external of ['https://evil.example/phish', '//evil.example', '/\\evil.example']) {
      await page.goto(`/login?returnUrl=${encodeURIComponent(external)}`);
      await submitLogin(page);

      await expect(page, `returnUrl ${external} must fall back to the list`).toHaveURL(
        /127\.0\.0\.1:4300\/$/,
      );
      await expect(profilesTotal(page)).toBeVisible();

      // Back to a signed-out state for the next iteration.
      await page.getByRole('button', { name: 'Account menu' }).click();
      await page.getByRole('menuitem', { name: 'Log Out' }).click();
      await expect(page).toHaveURL(/\/login$/);
    }
  });

  test('logs the admin in and shows the empty profiles list', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();

    await expect(page.getByText('Login successful')).toBeVisible();
    await expect(profilesTotal(page)).toHaveText(/^0 profiles$/);
  });

  test('logs the admin out and clears the session', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();

    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: 'Log Out' }).click();

    await expect(page.getByText('Logged out successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);

    // Not just a UI redirect: the session itself must be gone, so a fresh visit is also
    // redirected rather than showing the profiles list.
    await page.goto('/');
    await expect(page).toHaveURL(/\/login\?returnUrl=%2F$/);
  });
});
