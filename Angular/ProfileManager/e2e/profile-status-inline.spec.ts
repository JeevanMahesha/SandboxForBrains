import type { Page } from '@playwright/test';
import { FIRESTORE_EMULATOR_URL, PROJECT_ID, makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, selectStatusFilter, test } from './support/fixtures';

const DOCS_URL = `${FIRESTORE_EMULATOR_URL}/v1/projects/${PROJECT_ID}/databases/(default)/documents/profiles`;
const OWNER = { Authorization: 'Bearer owner' };

/** Status stored in Firestore for the profile with the given name (read straight from the emulator). */
async function storedStatus(name: string): Promise<string | undefined> {
  const { documents = [] } = (await (await fetch(DOCS_URL, { headers: OWNER })).json()) as {
    documents?: { fields: Record<string, { stringValue?: string }> }[];
  };
  return documents.find((d) => d.fields['name']?.stringValue === name)?.fields['profileStatusId']
    ?.stringValue;
}

/** Deletes every profile document behind the app's back (the list still shows its stale rows). */
async function deleteAllProfileDocs(): Promise<void> {
  const { documents = [] } = (await (await fetch(DOCS_URL, { headers: OWNER })).json()) as {
    documents?: { name: string }[];
  };
  for (const d of documents) {
    await fetch(`${FIRESTORE_EMULATOR_URL}/v1/${d.name}`, { method: 'DELETE', headers: OWNER });
  }
}

const trigger = (scope: Page | ReturnType<Page['locator']>, current: string) =>
  scope.getByRole('button', { name: `Change status, currently ${current}` });

test.describe('inline status change (desktop)', () => {
  test('picks a status from the pill menu, persists it and offers Undo', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Status Subject', profileStatusId: 'NEW' })]);
    await loginAsAdmin();

    const row = profileRows(page).first();
    await expect(trigger(row, 'New')).toHaveAttribute('aria-haspopup', 'menu');
    await trigger(row, 'New').click();

    // All 9 statuses are listed, the current one is marked.
    await expect(page.getByRole('menuitem')).toHaveCount(9);
    await expect(page.getByRole('menuitem', { name: 'New' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await page.getByRole('menuitem', { name: 'Accepted' }).click();

    await expect(trigger(row, 'Accepted')).toBeVisible();
    await expect(page.getByText('Status changed to Accepted')).toBeVisible();
    // Picking a status must not have opened the view drawer.
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect.poll(() => storedStatus('Status Subject')).toBe('ACCEPTED');
    // Focus goes back to the trigger when the menu closes.
    await expect(trigger(row, 'Accepted')).toBeFocused();

    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(trigger(row, 'New')).toBeVisible();
    await expect.poll(() => storedStatus('Status Subject')).toBe('NEW');

    await page.reload();
    await expect(trigger(profileRows(page).first(), 'New')).toBeVisible();
  });

  test('picking the current status writes nothing and shows no toast', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { profileStatusId: 'NEW' })]);
    await loginAsAdmin();

    await trigger(profileRows(page).first(), 'New').click();
    await page.getByRole('menuitem', { name: 'New' }).click();
    await expect(page.getByRole('menuitem')).toHaveCount(0);
    await expect(page.getByText(/Status changed to/)).toHaveCount(0);
  });

  test('works with the keyboard only', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0, { name: 'Keyboard Subject', profileStatusId: 'NEW' })]);
    await loginAsAdmin();

    const row = profileRows(page).first();
    await trigger(row, 'New').focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('menu')).toBeVisible();
    // Esc closes without a change and returns focus to the trigger.
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(trigger(row, 'New')).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.getByRole('menu')).toBeVisible();
    // The first item (New) is focused by the menu; arrow down moves to the next status.
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByText(/Status changed to/)).toBeVisible();
    await expect.poll(() => storedStatus('Keyboard Subject')).not.toBe('NEW');
    // Keyboard activation on the pill must not open the drawer either.
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('rejected card stays in place until reload, then moves to the end (D5)', async ({
    page,
    loginAsAdmin,
  }) => {
    // Newest first: index 2 is on top.
    await seedProfiles([
      makeProfile(0, { name: 'Oldest' }),
      makeProfile(1, { name: 'Middle' }),
      makeProfile(2, { name: 'Newest' }),
    ]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(3);
    await expect(profileRows(page).first()).toContainText('Newest');

    await trigger(profileRows(page).first(), 'New').click();
    await page.getByRole('menuitem', { name: 'Rejected' }).click();
    await expect(trigger(profileRows(page).first(), 'Rejected')).toBeVisible();
    await expect(profileRows(page).first()).toContainText('Newest');
    await expect.poll(() => storedStatus('Newest')).toBe('REJECTED');

    await page.reload();
    await expect(profileRows(page).last()).toContainText('Newest');
    await expect(trigger(profileRows(page).last(), 'Rejected')).toBeVisible();
  });

  test('a card hidden by the active status filter stays visible until the filter changes', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([
      makeProfile(0, { name: 'Accepted One', profileStatusId: 'ACCEPTED' }),
      makeProfile(1, { name: 'Other New', profileStatusId: 'NEW' }),
    ]);
    await loginAsAdmin();

    await selectStatusFilter(page, 'Accepted');
    await expect(profileRows(page)).toHaveCount(1);

    await trigger(profileRows(page).first(), 'Accepted').click();
    await page.getByRole('menuitem', { name: 'New' }).click();
    await expect(trigger(profileRows(page).first(), 'New')).toBeVisible();
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profileRows(page).first()).toContainText('Accepted One');
  });

  test('rolls the pill back and shows an error toast when the write fails', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Doomed', profileStatusId: 'NEW' })]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(1);

    // The row stays on screen but its document is gone, so the server rejects the update (NOT_FOUND).
    await deleteAllProfileDocs();

    await trigger(profileRows(page).first(), 'New').click();
    await page.getByRole('menuitem', { name: 'Accepted' }).click();

    await expect(page.getByText('Failed to update status')).toBeVisible();
    await expect(trigger(profileRows(page).first(), 'New')).toBeVisible();
    await expect(trigger(profileRows(page).first(), 'New')).toBeEnabled();
    await expect(page.getByText(/Status changed to/)).toHaveCount(0);
  });

  test('the view drawer header has the same menu and keeps the list in sync', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Drawer Subject', profileStatusId: 'NEW' })]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'View' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'View Profile' })).toBeVisible();

    await trigger(dialog, 'New').click();
    await page.getByRole('menuitem', { name: 'Contacted' }).click();
    await expect(trigger(dialog, 'Contacted')).toBeVisible();
    await expect.poll(() => storedStatus('Drawer Subject')).toBe('CONTACTED');

    // Edit mode keeps the plain badge: its status is part of the form being edited.
    await dialog.getByRole('button', { name: 'Edit' }).first().click();
    await expect(dialog.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Change status/ })).toHaveCount(0);
  });
});

test.describe('inline status change (mobile bottom sheet)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens a bottom sheet, picks a status, keeps the drawer closed, and Undo restores', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Mobile Status', profileStatusId: 'NEW' })]);
    await loginAsAdmin();

    const card = page.getByTestId('profile-card').first();
    const pill = trigger(card, 'New');
    await expect(pill).toHaveAttribute('aria-haspopup', 'dialog');

    await pill.click();
    const sheet = page.getByRole('dialog', { name: 'Change status' });
    await expect(sheet.getByRole('heading', { name: 'Change status' })).toBeVisible();
    // Rows are at least 44px tall.
    const rowBox = await sheet.getByRole('button', { name: 'Accepted' }).boundingBox();
    expect(rowBox!.height).toBeGreaterThanOrEqual(44);
    await sheet.getByRole('button', { name: 'Accepted' }).click();

    await expect(sheet).toHaveCount(0);
    await expect(trigger(card, 'Accepted')).toBeVisible();
    await expect(page.getByText('Status changed to Accepted')).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect.poll(() => storedStatus('Mobile Status')).toBe('ACCEPTED');

    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(trigger(card, 'New')).toBeVisible();
    await expect.poll(() => storedStatus('Mobile Status')).toBe('NEW');
  });

  test('card kebab is a 44px target and View is a visible button', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Tap Targets' })]);
    await loginAsAdmin();

    const card = page.getByTestId('profile-card').first();
    const kebab = await card.getByRole('button', { name: 'More actions' }).boundingBox();
    expect(kebab!.width).toBeGreaterThanOrEqual(44);
    expect(kebab!.height).toBeGreaterThanOrEqual(44);

    const view = card.getByRole('button', { name: 'View', exact: true });
    await expect(view).toBeVisible();
    expect((await view.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await view.click();
    await expect(
      page.getByRole('dialog').getByRole('heading', { name: 'View Profile' }),
    ).toBeVisible();
  });
});
