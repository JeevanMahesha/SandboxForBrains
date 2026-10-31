import { makeProfile, seedProfiles } from './support/emulator';
import { expect, openNotesTab, profileRows, test } from './support/fixtures';

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

  test('flags a Details error on its tab and focuses the invalid field on submit', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Tabbed Profile' })]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('tab', { name: 'Details' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    // Age lives in the Horoscope section with the other astrology fields.
    await expect(dialog.getByText('Horoscope', { exact: true })).toBeVisible();
    await expect(dialog.locator('#age')).toBeVisible();

    // Invalidate Name, then move to the Notes tab: the Details tab carries the error dot.
    await dialog.locator('#name').fill('');
    await dialog.locator('#mobile').focus();
    await expect(dialog.getByRole('tab', { name: 'Details (has errors)' })).toBeVisible();
    await openNotesTab(page);
    await expect(dialog.getByRole('tab', { name: 'Details (has errors)' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Update Profile' })).toBeDisabled();

    // Fixing the field clears the dot.
    await dialog.getByRole('tab', { name: /^Details/ }).click();
    await expect(dialog.getByText('Name is required')).toBeVisible();
    await dialog.locator('#name').fill('Fixed Name');
    await expect(dialog.getByRole('tab', { name: 'Details', exact: true })).toBeVisible();
  });

  test('submitting an invalid form from the Details tab focuses the first invalid field', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.locator('#name').fill('');
    await dialog.locator('#matrimony').focus();
    await dialog.locator('#matrimony').press('Enter');
    await expect(dialog.locator('#name')).toBeFocused();
  });
});
