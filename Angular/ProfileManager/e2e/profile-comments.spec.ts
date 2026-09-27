import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

test.describe('profile comments', () => {
  test('adds and deletes a comment, persisting both changes', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();

    await page.locator('#comment').fill('Called, will follow up next week');
    await page.getByRole('button', { name: 'Add comment' }).click();

    await expect(page.getByText('Called, will follow up next week')).toBeVisible();
    // The input clears so it's obvious the comment moved into the list below it.
    await expect(page.locator('#comment')).toHaveValue('');

    await page.getByRole('button', { name: 'Update Profile' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();

    // Reopen to prove the comment round-tripped through Firestore, not just held in form state.
    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByText('Called, will follow up next week')).toBeVisible();

    await page.getByRole('button', { name: 'Delete comment' }).click();
    await expect(page.getByText('No comments yet.')).toBeVisible();

    await page.getByRole('button', { name: 'Update Profile' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();

    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByText('No comments yet.')).toBeVisible();
  });

  test('saves a comment that was typed but never explicitly added', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    await page.locator('#comment').fill('Typed but never clicked Add');
    await page.getByRole('button', { name: 'Update Profile' }).click();

    await expect(page.getByText('Profile updated successfully')).toBeVisible();

    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByText('Typed but never clicked Add')).toBeVisible();
  });
});
