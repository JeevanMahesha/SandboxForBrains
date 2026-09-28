import { expect, profilesTotal, test } from './support/fixtures';

test.describe('authentication', () => {
  test('redirects an anonymous visitor to the login page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/login\?returnUrl=%2F$/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('logs the admin in and shows the empty profiles list', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();

    await expect(page.getByText('Login successful')).toBeVisible();
    await expect(profilesTotal(page)).toHaveText(/In total there are 0 profiles\./);
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
