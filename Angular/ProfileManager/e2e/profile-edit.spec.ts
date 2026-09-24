import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

test.describe('edit profile', () => {
  test('updates an existing profile from the drawer', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0, { name: 'Original Name' })]);
    await loginAsAdmin();

    const row = profileRows(page).first();
    await expect(row).toContainText('Original Name');
    await row.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();

    await page.locator('#name').fill('Renamed Profile');
    await page.getByRole('button', { name: 'Update Profile' }).click();

    await expect(page.getByText('Profile updated successfully')).toBeVisible();
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profileRows(page).first()).toContainText('Renamed Profile');
  });
});
