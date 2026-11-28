import type { Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, openNotesTab, profileRows, test } from './support/fixtures';

// WCAG 2.4.6: a screen-reader user listing the page's buttons must be able to tell the controls of
// one card from another's, so every card control's accessible name carries the profile's name.

async function seedTwoProfiles(): Promise<void> {
  await seedProfiles([
    makeProfile(0, { name: 'Ravi Kumar' }),
    makeProfile(1, { name: 'Meena Priya' }),
  ]);
}

/** Every name below must exist exactly once on the page, i.e. be unique across the two cards. */
async function expectUniqueNames(
  page: Page,
  role: 'button' | 'link',
  names: string[],
): Promise<void> {
  for (const name of names) {
    await expect(page.getByRole(role, { name, exact: true }), `${role} "${name}"`).toHaveCount(1);
  }
}

test.describe('desktop card control names', () => {
  test('every card control is named with its own profile', async ({ page, loginAsAdmin }) => {
    await seedTwoProfiles();
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(2);

    for (const who of ['Ravi Kumar', 'Meena Priya']) {
      await expectUniqueNames(page, 'button', [
        `View ${who}`,
        `Edit ${who}`,
        `Delete ${who}`,
        `Copy matrimony ID of ${who}`,
        `Copy mobile number of ${who}`,
      ]);
      await expectUniqueNames(page, 'link', [`Call ${who}`, `WhatsApp ${who}`]);
    }
  });
});

test.describe('phone card control names', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('every card control is named with its own profile', async ({ page, loginAsAdmin }) => {
    await seedTwoProfiles();
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(2);

    for (const who of ['Ravi Kumar', 'Meena Priya']) {
      await expectUniqueNames(page, 'button', [
        `View ${who}`,
        `More actions for ${who}`,
        `Copy matrimony ID of ${who}`,
        `Copy mobile number of ${who}`,
      ]);
      await expectUniqueNames(page, 'link', [`Call ${who}`, `WhatsApp ${who}`]);
    }
  });
});

test.describe('note delete buttons', () => {
  test('each delete button says which note it deletes', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0, { name: 'Ravi Kumar' })]);
    await loginAsAdmin();

    await page.getByRole('button', { name: 'Edit Ravi Kumar', exact: true }).click();
    const drawer = page.getByRole('dialog', { name: 'Edit Profile' });
    await openNotesTab(page);
    for (const note of ['First note', 'Second note']) {
      await drawer.locator('#comment').fill(note);
      await drawer.getByRole('button', { name: 'Add note' }).click();
    }

    // Two notes added in the same minute carry the same time, so the note text tells them apart.
    for (const note of ['First note', 'Second note']) {
      await expect(
        drawer.getByRole('button', {
          name: new RegExp(`^Delete note from \\d{2}/\\w{3}/\\d{2} \\d{2}:\\d{2}: ${note}$`),
        }),
        `delete button for "${note}"`,
      ).toHaveCount(1);
    }
  });
});
