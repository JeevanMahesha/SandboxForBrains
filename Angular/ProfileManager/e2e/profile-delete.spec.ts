import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, profilesTotal, test } from './support/fixtures';

test.describe('delete profile', () => {
  test('removes a profile after confirming the dialog', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await expect(profileRows(page)).toHaveCount(1);
    await profileRows(page).first().getByRole('button', { name: 'Delete' }).click();

    const dialog = page.locator('app-confirm-dialog');
    await expect(dialog.getByRole('heading', { name: 'Confirm Delete' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByText('Profile deleted successfully')).toBeVisible();
    await expect(profileRows(page)).toHaveCount(0);
    await expect(profilesTotal(page)).toHaveText(/In total there are 0 profiles\./);
  });

  test('keeps the profile when the dialog is cancelled', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'Delete' }).click();
    const dialog = page.locator('app-confirm-dialog');
    await dialog.getByRole('button', { name: 'Cancel' }).click();

    await expect(dialog).toHaveCount(0);
    await expect(profileRows(page)).toHaveCount(1);
  });
});
