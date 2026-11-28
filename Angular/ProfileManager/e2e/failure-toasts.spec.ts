import { ARIES_LABEL } from './support/constants';
import type { Page } from '@playwright/test';
import { PROFILE_STATUS } from '../src/app/constant/common.const';
import { makeProfile, readStoredProfiles, seedProfiles } from './support/emulator';
import {
  expect,
  fillWizardProfile,
  leaveWizardAndDiscard,
  openNewProfileWizard,
  openProfileDrawer,
  profileRows,
  profilesTotal,
  test,
} from './support/fixtures';

/**
 * Makes the next Firestore write fail. Firestore Lite sends every write (create, update, note,
 * delete) as a REST `:commit`; reads are `:runQuery`, so reads keep working. The response is a
 * permission error, which the SDK does not retry, so the app sees one clean rejection.
 * Returns the number of writes that were refused.
 */
async function failNextWrite(page: Page): Promise<() => number> {
  let refused = 0;
  await page.route(
    /:commit/,
    (route) => {
      refused++;
      return route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 403,
            message: 'Missing or insufficient permissions.',
            status: 'PERMISSION_DENIED',
          },
        }),
      });
    },
    { times: 1 },
  );
  return () => refused;
}

const storedNames = async () =>
  (await readStoredProfiles()).map(
    (fields) => (fields['name'] as { stringValue: string }).stringValue,
  );

test.describe('failure toasts', () => {
  test('a failed create says so, keeps the wizard and the typed data, and saves nothing', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);
    await fillWizardProfile(page, {
      name: 'Will Not Save',
      mobile: '98765 43210',
      matrimonyId: 'M-FAIL-CREATE',
      status: PROFILE_STATUS.NEW,
      zodiac: ARIES_LABEL,
      age: '27',
      state: 'Tamil Nadu',
      city: 'Chennai',
    });
    const refused = await failNextWrite(page);

    await page.getByRole('button', { name: 'Create profile' }).click();

    await expect(page.getByText('Failed to add profile')).toBeVisible();
    expect(refused()).toBe(1);
    await expect(page.getByText('Profile added successfully')).toHaveCount(0);
    // Still on the last step of the wizard, nothing was lost, and nothing reached Firestore.
    await expect(page).toHaveURL(/\/profiles\/new$/);
    await expect(page.getByRole('button', { name: 'Create profile' })).toBeEnabled();
    await expect(page.locator('#city')).toContainText('Chennai');
    expect(await storedNames()).toEqual([]);

    // The data is intact: going back to step 1 still shows what was typed.
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(page.locator('#name')).toHaveValue('Will Not Save');

    await leaveWizardAndDiscard(page);
  });

  test('a failed edit save says so and keeps the drawer open with the new value', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Original Name' })]);
    await loginAsAdmin();
    await openProfileDrawer(page, 'Edit');
    await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
    await page.locator('#name').fill('Changed Name');
    const refused = await failNextWrite(page);

    await page.getByRole('button', { name: 'Update Profile' }).click();

    await expect(page.getByText('Failed to update profile')).toBeVisible();
    expect(refused()).toBe(1);
    await expect(page.getByText('Profile updated successfully')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
    await expect(page.locator('#name')).toHaveValue('Changed Name');
    expect(await storedNames()).toEqual(['Original Name']);

    // The same click works once the write succeeds again (nothing is stuck in a saving state).
    await page.getByRole('button', { name: 'Update Profile' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();
    expect(await storedNames()).toEqual(['Changed Name']);
  });

  test('a failed quick note says so and keeps the typed note', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();
    await openProfileDrawer(page, 'View');
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'View Profile' })).toBeVisible();
    const input = dialog.locator('#quick-note');
    await input.fill('This will not be saved');
    const refused = await failNextWrite(page);

    await input.press('Enter');

    await expect(page.getByText('Failed to add note')).toBeVisible();
    expect(refused()).toBe(1);
    await expect(page.getByText('Note added')).toHaveCount(0);
    await expect(input).toHaveValue('This will not be saved');
    await expect(dialog.getByRole('heading', { name: 'Notes · 0' })).toBeVisible();

    // Retrying with the same text saves it.
    await input.press('Enter');
    await expect(page.getByText('Note added')).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Notes · 1' })).toBeVisible();
  });

  test('a failed delete brings the profile back and says so', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0, { name: 'Survivor' }), makeProfile(1)]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(2);
    await expect(profilesTotal(page)).toHaveText(/^2 profiles$/);
    const refused = await failNextWrite(page);

    await profileRows(page)
      .filter({ hasText: 'Survivor' })
      .getByRole('button', { name: 'Delete' })
      .click();
    await page.locator('app-confirm-dialog').getByRole('button', { name: 'Delete' }).click();
    // Optimistic: the row is gone at once, while the 6 second Undo window is still open.
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profilesTotal(page)).toHaveText(/^1 profile$/);

    // When the window ends the real delete runs, is refused, and the row comes back.
    await expect(page.getByText('Failed to delete profile')).toBeVisible({ timeout: 15_000 });
    expect(refused()).toBe(1);
    await expect(profileRows(page)).toHaveCount(2);
    await expect(profileRows(page).filter({ hasText: 'Survivor' })).toHaveCount(1);
    await expect(profilesTotal(page)).toHaveText(/^2 profiles$/);
    expect(await storedNames()).toContain('Survivor');
  });
});
