import type { Page } from '@playwright/test';
import { makeProfile, readStoredProfiles, seedProfiles } from './support/emulator';
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

  test('saving an edit changes only the form fields, not id or createdAt', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Original Name' })]);
    const [before] = await readStoredProfiles();
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    await page.locator('#name').fill('Renamed Profile');
    await page.getByRole('button', { name: 'Update Profile' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();

    const [after] = await readStoredProfiles();
    expect(after['name']).toEqual({ stringValue: 'Renamed Profile' });
    // The document id is derived client-side and must never be persisted as a field.
    expect(after).not.toHaveProperty('id');
    // Creation time is immutable.
    expect(after['createdAt']).toEqual(before['createdAt']);
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
    // Save stays clickable so a submit can explain what is wrong, instead of a dead button.
    await expect(dialog.getByRole('button', { name: 'Update Profile' })).toBeEnabled();

    // Fixing the field clears the dot.
    await dialog.getByRole('tab', { name: /^Details/ }).click();
    await expect(dialog.getByText('Name is required')).toBeVisible();
    await dialog.locator('#name').fill('Fixed Name');
    await expect(dialog.getByRole('tab', { name: 'Details', exact: true })).toBeVisible();
  });

  test('Save on the Notes tab of an invalid profile shows what is wrong on the Details tab', async ({
    page,
    loginAsAdmin,
  }) => {
    // A legacy profile with no city: invalid from the start, and the Notes tab hides the cause.
    await seedProfiles([makeProfile(0, { name: 'No City Profile', city: '' })]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    const dialog = page.getByRole('dialog');
    await openNotesTab(page);

    const save = dialog.getByRole('button', { name: 'Update Profile' });
    await expect(save).toBeEnabled();
    await save.click();

    await expect(dialog.getByRole('tab', { name: /^Details/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(dialog.getByText('City is required')).toBeVisible();
    await expect(page.getByText('Profile updated successfully')).toHaveCount(0);
    // Still editing: nothing was saved and the drawer stayed open.
    await expect(dialog.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
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

test.describe('closing the edit drawer', () => {
  const openEdit = async (page: Page) => {
    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();
    const drawer = page.getByRole('dialog', { name: 'Edit Profile' });
    await expect(drawer.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
    return drawer;
  };
  const discardPrompt = (page: Page) => page.getByRole('dialog', { name: 'Discard changes?' });

  test('asks before discarding edits: Cancel keeps them, Discard drops them', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Close Me' })]);
    await loginAsAdmin();

    const drawer = await openEdit(page);
    await drawer.locator('#name').fill('Changed Name');

    // Esc must not silently throw the edit away.
    await drawer.locator('#name').press('Escape');
    await expect(discardPrompt(page)).toBeVisible();
    await discardPrompt(page).getByRole('button', { name: 'Cancel' }).click();
    await expect(discardPrompt(page)).toBeHidden();
    await expect(drawer.locator('#name')).toHaveValue('Changed Name');

    // Same for the corner X.
    await drawer.getByRole('button', { name: 'Close' }).click();
    await expect(discardPrompt(page)).toBeVisible();
    await discardPrompt(page).getByRole('button', { name: 'Discard' }).click();
    await expect(drawer.getByRole('heading', { name: 'Edit Profile' })).toBeHidden();

    // Nothing was saved, and reopening starts from the stored profile.
    await expect(profileRows(page).first()).toContainText('Close Me');
    const reopened = await openEdit(page);
    await expect(reopened.locator('#name')).toHaveValue('Close Me');
  });

  test('closes without asking when nothing was changed', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    const drawer = await openEdit(page);
    await drawer.locator('#name').press('Escape');
    await expect(drawer.getByRole('heading', { name: 'Edit Profile' })).toBeHidden();
    await expect(discardPrompt(page)).toHaveCount(0);

    const reopened = await openEdit(page);
    await reopened.getByRole('button', { name: 'Close' }).click();
    await expect(reopened.getByRole('heading', { name: 'Edit Profile' })).toBeHidden();
    await expect(discardPrompt(page)).toHaveCount(0);
  });

  test('an unsaved note counts as a change', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    const drawer = await openEdit(page);
    await openNotesTab(page);
    await drawer.locator('#comment').fill('A note nobody saved');
    await drawer.getByRole('button', { name: 'Add note' }).click();
    await expect(drawer.getByText('A note nobody saved')).toBeVisible();

    await drawer.locator('#comment').press('Escape');
    await expect(discardPrompt(page)).toBeVisible();
  });
});

test.describe('duplicates when editing', () => {
  const openEditFor = async (page: Page, name: string) => {
    await profileRows(page).filter({ hasText: name }).getByRole('button', { name: 'Edit' }).click();
    const drawer = page.getByRole('dialog', { name: 'Edit Profile' });
    await expect(drawer.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
    return drawer;
  };

  test.beforeEach(async () => {
    // Profile 0: M1000 / +919876543200. Profile 1 deliberately shares profile 0's number (a
    // legacy duplicate) and has its own ID, M1001.
    await seedProfiles([
      makeProfile(0, { name: 'Ravi Kumar' }),
      makeProfile(1, { name: 'Divya S', mobileNumber: '+919876543200' }),
    ]);
  });

  test("changing the ID to another profile's ID is blocked", async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    const drawer = await openEditFor(page, 'Divya S');

    await drawer.locator('#matrimony').fill('M1000');
    await drawer.getByRole('button', { name: 'Update Profile' }).click();

    await expect(drawer.locator('#matrimony-error')).toHaveText(
      'Matrimony ID M1000 already belongs to Ravi Kumar',
    );
    await expect(page.getByText('Profile updated successfully')).toHaveCount(0);
    await expect(drawer.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
  });

  test('editing unrelated fields still saves when the profile already shares a number', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    const drawer = await openEditFor(page, 'Divya S');

    await drawer.locator('#name').fill('Divya Sundaram');
    await drawer.getByRole('button', { name: 'Update Profile' }).click();

    await expect(page.getByText('Profile updated successfully')).toBeVisible();
    await expect(profileRows(page).filter({ hasText: 'Divya Sundaram' })).toHaveCount(1);
  });

  test("a profile's own ID and number are not duplicates of themselves", async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    const drawer = await openEditFor(page, 'Ravi Kumar');

    // Retyped in a different shape, but the same ID and the same canonical number.
    await drawer.locator('#matrimony').fill(' M1000 ');
    await drawer.locator('#mobile').fill('98765 43200');
    await drawer.getByRole('button', { name: 'Update Profile' }).click();

    await expect(page.getByText('Profile updated successfully')).toBeVisible();
  });

  test('changing the number to one another profile uses is blocked', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(2, { name: 'Third Person' })]); // +919876543202
    await loginAsAdmin();
    const drawer = await openEditFor(page, 'Third Person');

    await drawer.locator('#mobile').fill('98765 43200');
    await drawer.getByRole('button', { name: 'Update Profile' }).click();

    // Two profiles already use that number; the message names one of them.
    await expect(drawer.locator('#mobile-error')).toContainText(
      'This mobile number already belongs to',
    );
    await expect(page.getByText('Profile updated successfully')).toHaveCount(0);
  });
});
