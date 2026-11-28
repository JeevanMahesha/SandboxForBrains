import { makeProfile, readStoredProfiles, seedProfiles } from './support/emulator';
import { expect, profileRows, profilesTotal, selectStatusFilter, test } from './support/fixtures';

/** How long a confirmed delete stays undoable (ProfilesService.DELETE_UNDO_MS). */
const UNDO_WINDOW_MS = 6000;

const storedCount = async () => (await readStoredProfiles()).length;

test.describe('delete profile', () => {
  test('removes a profile after confirming, and really deletes it once the undo window ends', async ({
    page,
    loginAsAdmin,
  }) => {
    await page.clock.install();
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

    // The card goes at once, with an Undo; nothing has been deleted yet.
    await expect(profileRows(page)).toHaveCount(0);
    await expect(profilesTotal(page)).toHaveText(/^0 profiles$/);
    await expect(page.getByText('Deleted Seed Profile 01 (M1000)')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Undo' })).toBeVisible();
    expect(await storedCount()).toBe(1);

    await page.clock.fastForward(UNDO_WINDOW_MS + 500);
    await expect.poll(storedCount).toBe(0);
    await expect(profileRows(page)).toHaveCount(0);
  });

  test('Undo brings the profile back and it is never deleted', async ({ page, loginAsAdmin }) => {
    await page.clock.install();
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(1);

    await profileRows(page).first().getByRole('button', { name: 'Delete' }).click();
    await page.locator('app-confirm-dialog').getByRole('button', { name: 'Delete' }).click();
    await expect(profileRows(page)).toHaveCount(0);

    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profilesTotal(page)).toHaveText(/^1 profile$/);

    // Well past the window: the cancelled delete must not run.
    await page.clock.fastForward(UNDO_WINDOW_MS * 2);
    await expect(profileRows(page)).toHaveCount(1);
    expect(await storedCount()).toBe(1);
  });

  test('two pending deletes run on their own timers and one can be undone', async ({
    page,
    loginAsAdmin,
  }) => {
    await page.clock.install();
    await seedProfiles([makeProfile(0), makeProfile(1), makeProfile(2)]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(3);

    // Newest first, so the rows are 03, 02, 01. Delete 03, then 02.
    for (const name of ['Seed Profile 03', 'Seed Profile 02']) {
      await profileRows(page)
        .filter({ hasText: name })
        .getByRole('button', { name: 'Delete' })
        .click();
      await page.locator('app-confirm-dialog').getByRole('button', { name: 'Delete' }).click();
      await expect(profileRows(page).filter({ hasText: name })).toHaveCount(0);
    }
    await expect(profilesTotal(page)).toHaveText(/^1 profile$/);

    // Undo only one of them (the toasts stack; any single Undo restores exactly one profile).
    await page.getByRole('button', { name: 'Undo' }).first().click();
    await page.clock.fastForward(UNDO_WINDOW_MS + 500);

    await expect.poll(storedCount).toBe(2);
    await expect(profileRows(page)).toHaveCount(2);
    await expect(profileRows(page).filter({ hasText: 'Seed Profile 01' })).toHaveCount(1);
  });

  test('signing out inside the undo window does not delete the profile', async ({
    page,
    loginAsAdmin,
  }) => {
    await page.clock.install();
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(1);

    await profileRows(page).first().getByRole('button', { name: 'Delete' }).click();
    await page.locator('app-confirm-dialog').getByRole('button', { name: 'Delete' }).click();
    await expect(profileRows(page)).toHaveCount(0);

    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: 'Log Out' }).click();
    await expect(page).toHaveURL(/\/login$/);

    // The pending delete is dropped with the session: it must never run.
    await page.clock.fastForward(UNDO_WINDOW_MS * 2);
    expect(await storedCount()).toBe(1);
  });

  test('a pending delete stays hidden when the filter changes', async ({ page, loginAsAdmin }) => {
    await page.clock.install();
    await seedProfiles([
      makeProfile(0, { name: 'Keep Me', profileStatusId: 'ACCEPTED' }),
      makeProfile(1, { name: 'Delete Me', profileStatusId: 'NEW' }),
    ]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(2);

    await profileRows(page)
      .filter({ hasText: 'Delete Me' })
      .getByRole('button', { name: 'Delete Delete Me', exact: true })
      .click();
    await page.locator('app-confirm-dialog').getByRole('button', { name: 'Delete' }).click();
    await expect(profileRows(page)).toHaveCount(1);

    // Still stored, but it must not reappear (nor be counted) under the filter that matches it.
    await selectStatusFilter(page, 'New');
    await expect(profileRows(page)).toHaveCount(0);
    await expect(profilesTotal(page)).toHaveText(/^0 profiles$/);

    await selectStatusFilter(page, 'All statuses');
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profileRows(page).first()).toContainText('Keep Me');
  });

  test('deleting the only row on the last page lands on the new last page', async ({
    page,
    loginAsAdmin,
  }) => {
    await page.clock.install();
    // 13 profiles with page size 12: page 2 holds exactly one row.
    await seedProfiles(Array.from({ length: 13 }, (_, index) => makeProfile(index)));
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(12);

    const pagination = page.getByRole('navigation', { name: 'pagination' });
    await pagination.getByText('2', { exact: true }).click();
    await expect(profileRows(page)).toHaveCount(1);

    await profileRows(page).first().getByRole('button', { name: 'Delete' }).click();
    await page.locator('app-confirm-dialog').getByRole('button', { name: 'Delete' }).click();

    // Straight away, not after the undo window: page 1 with the other 12.
    await expect(profilesTotal(page)).toHaveText(/^12 profiles$/);
    await expect(profileRows(page)).toHaveCount(12);
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('1');

    await page.clock.fastForward(UNDO_WINDOW_MS + 500);
    await expect.poll(storedCount).toBe(12);
    await expect(profilesTotal(page)).toHaveText(/^12 profiles$/);
    await expect(profileRows(page)).toHaveCount(12);
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
