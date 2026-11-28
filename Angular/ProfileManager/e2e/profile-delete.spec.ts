import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, profilesTotal, test } from './support/fixtures';

test.describe('delete profile', () => {
  test('removes a profile after confirming the dialog', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await expect(profileRows(page)).toHaveCount(1);
    await profileRows(page).first().getByRole('button', { name: 'Delete' }).click();

    const dialog = page.locator('app-confirm-dialog');
    await expect(
      dialog.getByRole('heading', { name: 'Delete Seed Profile 01 (M1000)?' }),
    ).toBeVisible();
    await expect(dialog.getByText("This can't be undone.")).toBeVisible();
    // No corner X: it collided with long titles, and Cancel / Esc already dismiss the dialog.
    await expect(page.getByRole('dialog').getByRole('button', { name: /close/i })).toHaveCount(0);
    await dialog.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByText('Profile deleted successfully')).toBeVisible();
    await expect(profileRows(page)).toHaveCount(0);
    await expect(profilesTotal(page)).toHaveText(/^0 profiles$/);
  });

  test('deleting the only row on the last page lands on the new last page', async ({
    page,
    loginAsAdmin,
  }) => {
    // 13 profiles with page size 12: page 2 holds exactly one row.
    await seedProfiles(Array.from({ length: 13 }, (_, index) => makeProfile(index)));
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(12);

    const pagination = page.getByRole('navigation', { name: 'pagination' });
    await pagination.getByText('2', { exact: true }).click();
    await expect(profileRows(page)).toHaveCount(1);

    await profileRows(page).first().getByRole('button', { name: 'Delete' }).click();
    await page.locator('app-confirm-dialog').getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Profile deleted successfully')).toBeVisible();

    await expect(profilesTotal(page)).toHaveText(/^12 profiles$/);
    await expect(profileRows(page)).toHaveCount(12);
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('1');
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

  test('keeps the profile when the dialog is dismissed with Escape', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'Delete' }).click();
    const dialog = page.locator('app-confirm-dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');

    await expect(dialog).toHaveCount(0);
    await expect(profileRows(page)).toHaveCount(1);
  });
});
