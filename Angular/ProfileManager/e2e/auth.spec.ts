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
});
