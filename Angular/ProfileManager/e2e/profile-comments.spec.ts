import type { Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import {
  expect,
  fillWizardProfile,
  openNewProfileWizard,
  openNotesTab,
  openProfileDrawer,
  test,
} from './support/fixtures';

test.describe('profile comments', () => {
  test('adds and deletes a comment, persisting both changes', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await openProfileDrawer(page, 'Edit');
    await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();

    await openNotesTab(page);
    await page.locator('#comment').fill('Called, will follow up next week');
    await page.getByRole('button', { name: 'Add note' }).click();

    await expect(page.getByText('Called, will follow up next week')).toBeVisible();
    // The input clears so it's obvious the comment moved into the list below it.
    await expect(page.locator('#comment')).toHaveValue('');

    await page.getByRole('button', { name: 'Update Profile' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();

    // Reopen to prove the comment round-tripped through Firestore, not just held in form state.
    await openProfileDrawer(page, 'Edit');
    await openNotesTab(page);
    await expect(page.getByText('Called, will follow up next week')).toBeVisible();

    await page.getByRole('button', { name: 'Delete note' }).click();
    await expect(page.getByText('No notes yet.')).toBeVisible();

    await page.getByRole('button', { name: 'Update Profile' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();

    await openProfileDrawer(page, 'Edit');
    await openNotesTab(page);
    await expect(page.getByText('No notes yet.')).toBeVisible();
  });

  test('deleting one note keeps other notes that have the same text', async ({
    page,
    loginAsAdmin,
  }) => {
    const sameText = 'Called, no answer';
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await openProfileDrawer(page, 'Edit');
    await openNotesTab(page);
    for (const note of [sameText, 'A different note', sameText]) {
      await page.locator('#comment').fill(note);
      await page.getByRole('button', { name: 'Add note' }).click();
    }
    await expect(page.getByRole('button', { name: 'Delete note' })).toHaveCount(3);

    // Delete only the first "Called, no answer"; the second one must survive.
    await page.getByRole('button', { name: 'Delete note' }).first().click();
    await expect(page.getByRole('button', { name: 'Delete note' })).toHaveCount(2);
    await expect(page.getByText(sameText)).toHaveCount(1);
    await expect(page.getByText('A different note')).toBeVisible();

    await page.getByRole('button', { name: 'Update Profile' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();

    // Persisted: the surviving duplicate is still there after reopening.
    await openProfileDrawer(page, 'Edit');
    await openNotesTab(page);
    await expect(page.getByText(sameText)).toHaveCount(1);
    await expect(page.getByText('A different note')).toBeVisible();
  });

  test('saves a comment that was typed but never explicitly added', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await openProfileDrawer(page, 'Edit');
    await openNotesTab(page);
    await page.locator('#comment').fill('Typed but never clicked Add');
    // Back on Details: the typed note lives in shared form state and is still saved.
    await page.getByRole('tab', { name: 'Details' }).click();
    await page.getByRole('button', { name: 'Update Profile' }).click();

    await expect(page.getByText('Profile updated successfully')).toBeVisible();

    await openProfileDrawer(page, 'Edit');
    await openNotesTab(page);
    await expect(page.getByText('Typed but never clicked Add')).toBeVisible();
  });
});

test.describe('note wording', () => {
  test('the create wizard calls them notes, like the edit drawer does', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);
    await fillWizardProfile(page, {
      name: 'Wording Test',
      mobile: '98765 43210',
      matrimonyId: 'M-Wording',
      status: 'New',
      zodiac: 'Mesham (Aries)',
      age: '27',
      state: 'Tamil Nadu',
      city: 'Chennai',
    });

    await expect(page.getByLabel('Add a note', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Add a note')).toBeVisible();
    await expect(page.getByText('No notes yet.')).toBeVisible();

    await page.locator('#comment').fill('First note');
    await page.getByRole('button', { name: 'Add note' }).click();
    await expect(page.getByRole('button', { name: 'Delete note' })).toBeVisible();
    // Wording only: no "comment" left anywhere the user can read it.
    await expect(page.getByText(/comment/i)).toHaveCount(0);
  });
});

test.describe('quick note in the view drawer', () => {
  const openView = async (page: Page) => {
    await openProfileDrawer(page, 'View');
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'View Profile' })).toBeVisible();
    return dialog;
  };

  test('adds notes with Enter or the button, keeps earlier ones and counts them', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    const dialog = await openView(page);
    await expect(dialog.getByRole('heading', { name: 'Notes · 0' })).toBeVisible();
    await expect(dialog.getByText('Press Enter to add')).toBeVisible();

    const input = dialog.locator('#quick-note');
    await input.fill('First quick note');
    await input.press('Enter');
    await expect(page.getByText('Note added')).toBeVisible();
    await expect(dialog.getByText('First quick note')).toBeVisible();
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();

    await input.fill('Second quick note');
    await dialog.getByRole('button', { name: 'Add note' }).click();
    await expect(dialog.getByText('Second quick note')).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Notes · 2' })).toBeVisible();

    // Persisted: reopen the drawer, both notes are still there.
    await dialog.locator('hlm-sheet-footer').getByRole('button', { name: 'Close' }).click();
    await expect(dialog).toBeHidden();
    const reopened = await openView(page);
    await expect(reopened.getByText('First quick note')).toBeVisible();
    await expect(reopened.getByText('Second quick note')).toBeVisible();
    await expect(reopened.getByRole('heading', { name: 'Notes · 2' })).toBeVisible();
  });

  test('ignores whitespace-only input and keeps legacy string notes', async ({
    page,
    loginAsAdmin,
  }) => {
    // Older documents stored comments as plain strings; arrayUnion must not disturb them.
    await seedProfiles([
      makeProfile(0, { comments: ['Legacy string note'] as unknown as never[] }),
    ]);
    await loginAsAdmin();

    const dialog = await openView(page);
    await expect(dialog.getByText('Legacy string note')).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Notes · 1' })).toBeVisible();

    const input = dialog.locator('#quick-note');
    await input.fill('   ');
    await expect(dialog.getByRole('button', { name: 'Add note' })).toBeDisabled();
    await input.press('Enter');
    await expect(dialog.getByRole('heading', { name: 'Notes · 1' })).toBeVisible();
    await expect(input).toBeFocused();

    await input.fill('New note next to legacy');
    await input.press('Enter');
    await expect(dialog.getByText('New note next to legacy')).toBeVisible();
    await expect(dialog.getByText('Legacy string note')).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Notes · 2' })).toBeVisible();
  });
});
