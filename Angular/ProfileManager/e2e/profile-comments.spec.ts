import type { Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, openNotesTab, profileRows, test } from './support/fixtures';

test.describe('profile comments', () => {
  test('adds and deletes a comment, persisting both changes', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
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
    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    await openNotesTab(page);
    await expect(page.getByText('Called, will follow up next week')).toBeVisible();

    await page.getByRole('button', { name: 'Delete comment' }).click();
    await expect(page.getByText('No comments yet.')).toBeVisible();

    await page.getByRole('button', { name: 'Update Profile' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();

    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    await openNotesTab(page);
    await expect(page.getByText('No comments yet.')).toBeVisible();
  });

  test('saves a comment that was typed but never explicitly added', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    await openNotesTab(page);
    await page.locator('#comment').fill('Typed but never clicked Add');
    // Back on Details: the typed note lives in shared form state and is still saved.
    await page.getByRole('tab', { name: 'Details' }).click();
    await page.getByRole('button', { name: 'Update Profile' }).click();

    await expect(page.getByText('Profile updated successfully')).toBeVisible();

    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    await openNotesTab(page);
    await expect(page.getByText('Typed but never clicked Add')).toBeVisible();
  });
});

test.describe('quick note in the view drawer', () => {
  const openView = async (page: Page) => {
    await profileRows(page).first().getByRole('button', { name: 'View' }).click();
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
