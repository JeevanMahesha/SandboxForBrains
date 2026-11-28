import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

test.describe('star match score ring', () => {
  test('a scored card exposes the score as a named image with its explanation', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Scored Profile', starMatchScore: 8 })]);
    await loginAsAdmin();

    const ring = profileRows(page).first().getByRole('img', { name: 'Star match score 8 of 10' });
    await expect(ring).toBeVisible();
    // The tooltip's explanation must not be hover-only: it is the ring's accessible description.
    await expect(ring).toHaveAccessibleDescription(/Compatibility score between/);
  });

  test('an unscored card keeps the not-specified name', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0, { name: 'Unscored Profile', starMatchScore: null })]);
    await loginAsAdmin();

    await expect(
      profileRows(page).first().getByRole('img', { name: 'Star match score not specified' }),
    ).toBeVisible();
  });

  test('the view drawer names its read-only score ring', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0, { name: 'Drawer Profile', starMatchScore: 8 })]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'View' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'View Profile' })).toBeVisible();
    await expect(dialog.getByRole('img', { name: 'Star match score 8 of 10' })).toBeVisible();
  });
});
