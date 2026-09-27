import { expect, pickOption, profileRows, profilesTotal, test } from './support/fixtures';

test.describe('create profile', () => {
  test('saves a new profile through the drawer and lists it', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();

    await page.getByRole('button', { name: 'Add Profile' }).click();
    await expect(page.getByRole('heading', { name: 'Add New Profile' })).toBeVisible();

    await page.locator('#name').fill('Anjali Kumar');
    await page.locator('#mobile').fill('98765 43210');
    await page.locator('#matrimony').fill('M2026');
    await pickOption(page, 'hlm-select#profile_status', 'New');
    await pickOption(page, 'hlm-select#zodiac_sign', 'Mesham (Aries)');
    await page.locator('#age').fill('27');
    await pickOption(page, 'hlm-select#state', 'Tamil Nadu');
    await pickOption(page, 'hlm-select#city', 'Chennai');

    await page.getByRole('button', { name: 'Save Changes' }).click();

    await expect(page.getByText('Profile added successfully')).toBeVisible();
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profileRows(page).first()).toContainText('Anjali Kumar');
    // The loosely typed number is persisted in the canonical +91 form.
    await expect(profileRows(page).first()).toContainText('+919876543210');
    await expect(profilesTotal(page)).toHaveText(/In total there are 1 profiles\./);
  });

  test('does not carry an abandoned draft into the next Add Profile', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();

    await page.getByRole('button', { name: 'Add Profile' }).click();
    await page.locator('#name').fill('Abandoned Draft');
    // The sheet's built-in close (X) button — there is no separate "Close" footer button in
    // create mode, only "Save Changes".
    await page.getByRole('button', { name: 'Close' }).click();

    await page.getByRole('button', { name: 'Add Profile' }).click();
    await expect(page.locator('#name')).toHaveValue('');
  });
});
