import { ADMIN_USER } from './support/emulator';
import { expect, profilesTotal, test } from './support/fixtures';

test.describe('unknown URLs', () => {
  test('a signed-in visitor on a mistyped URL lands on the profiles list', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();

    await page.goto('/profiel/new');

    await expect(page).toHaveURL(/127\.0\.0\.1:4300\/$/);
    await expect(profilesTotal(page)).toBeVisible();
  });

  test('a signed-out visitor is sent to login, then lands on the list (not the bad URL)', async ({
    page,
  }) => {
    await page.goto('/does-not-exist');

    await expect(page).toHaveURL(/\/login\?returnUrl=%2F$/);

    await page.locator('#login-email').fill(ADMIN_USER.email);
    await page.locator('#login-password').fill(ADMIN_USER.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/127\.0\.0\.1:4300\/$/);
    await expect(profilesTotal(page)).toBeVisible();
  });
});
