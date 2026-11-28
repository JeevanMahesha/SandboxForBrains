import type { Page } from '@playwright/test';
import { PROFILE_STATUS } from '../src/app/constant/common.const';
import { ADMIN_USER, makeProfile, seedProfiles } from './support/emulator';
import { expect, profilesTotal, selectStatusFilter, statusFilter, test } from './support/fixtures';

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

  test('shows one inline message for a wrong password and for an unknown email', async ({
    page,
  }) => {
    await page.goto('/login');
    await expect(page.locator('#login-email')).toBeEnabled();
    const error = page.locator('#login-error');

    // Wrong password for a real account.
    await page.locator('#login-email').fill(ADMIN_USER.email);
    await page.locator('#login-password').fill('not-the-password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(error).toHaveText('Incorrect email or password');
    await expect(error).toHaveAttribute('role', 'alert');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('#login-password')).toBeFocused();

    // Unknown email: the identical message, so the form never reveals which accounts exist.
    await page.locator('#login-email').fill('nobody@example.com');
    await page.locator('#login-password').fill('whatever-123');
    await expect(error).toHaveCount(0); // typing cleared the previous message
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(error).toHaveText('Incorrect email or password');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('clears the login error as soon as the user edits a field', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#login-email')).toBeEnabled();
    await page.locator('#login-email').fill(ADMIN_USER.email);
    await page.locator('#login-password').fill('not-the-password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('#login-error')).toBeVisible();

    await page.locator('#login-password').press('a');
    await expect(page.locator('#login-error')).toHaveCount(0);
  });

  test('says so when the sign-in request cannot reach the server', async ({ page }) => {
    await page.route(/identitytoolkit|accounts:signInWithPassword/, (route) => route.abort());
    await page.goto('/login');
    await expect(page.locator('#login-email')).toBeEnabled();
    await page.locator('#login-email').fill(ADMIN_USER.email);
    await page.locator('#login-password').fill(ADMIN_USER.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('#login-error')).toHaveText(
      'Cannot reach the server. Check your connection and try again.',
    );
  });

  test('logs the admin in and shows the empty profiles list', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();

    await expect(page.getByText('Login successful')).toBeVisible();
    await expect(profilesTotal(page)).toHaveText(/^0 profiles$/);
    // A genuinely empty list still gets the first-profile prompt.
    await expect(page.getByText('No profiles yet')).toBeVisible();
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

  test('a new login starts from the default filters, not the previous session', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles(
      Array.from({ length: 14 }, (_, index) =>
        makeProfile(index, { profileStatusId: index < 8 ? 'NEW' : 'ACCEPTED' }),
      ),
    );
    await loginAsAdmin();
    await expect(profilesTotal(page)).toHaveText(/^14 profiles$/);
    await selectStatusFilter(page, PROFILE_STATUS.ACCEPTED);
    await expect(profilesTotal(page)).toHaveText(/^6 profiles$/);

    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: 'Log Out' }).click();
    await expect(page).toHaveURL(/\/login$/);

    // Right after the client-side navigation to /login, an early fill() can reach the form
    // before its field directive is bound (NG0950) and be lost, so retry the login step.
    await expect(async () => {
      await submitLogin(page);
      await expect(page).toHaveURL(/\/$/, { timeout: 3000 });
    }).toPass();

    await expect(statusFilter(page)).toHaveText(/All statuses/);
    await expect(profilesTotal(page)).toHaveText(/^14 profiles$/);
  });
});
