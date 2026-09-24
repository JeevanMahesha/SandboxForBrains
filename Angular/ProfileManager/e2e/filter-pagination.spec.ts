import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, profilesTotal, test } from './support/fixtures';

test.describe('filtering and pagination', () => {
  test.beforeEach(async () => {
    // 12 profiles: 8 NEW and 4 ACCEPTED. Page size is 10.
    await seedProfiles(
      Array.from({ length: 12 }, (_, index) =>
        makeProfile(index, { profileStatusId: index < 8 ? 'NEW' : 'ACCEPTED' }),
      ),
    );
  });

  test('pages through the list', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();

    await expect(profileRows(page)).toHaveCount(10);
    await expect(profilesTotal(page)).toHaveText(/In total there are 12 profiles\./);

    const pagination = page.getByRole('navigation', { name: 'pagination' });
    await pagination.getByText('2', { exact: true }).click();

    await expect(profileRows(page)).toHaveCount(2);
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('2');
  });

  test('filters by profile status', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(10);

    // Spartan's trigger has no accessible name; its visible text is the placeholder.
    await page.getByRole('combobox').filter({ hasText: 'Select Status' }).click();
    await page.getByRole('option', { name: 'Accepted', exact: true }).click();

    await expect(profileRows(page)).toHaveCount(4);
    await expect(profilesTotal(page)).toHaveText(/In total there are 4 profiles\./);
    for (const row of await profileRows(page).all()) {
      await expect(row).toContainText('Accepted');
    }
  });
});
