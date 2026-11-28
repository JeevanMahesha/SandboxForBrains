import type { Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

/** Names of the Firestore IndexedDB databases the page has created (the SDK's persistent cache). */
async function firestoreDatabases(page: Page): Promise<string[]> {
  return page.evaluate(async () => {
    const databases = await indexedDB.databases();
    return databases
      .map((database) => database.name ?? '')
      .filter((name) => /firestore/i.test(name));
  });
}

test.describe('profile data is not kept on disk', () => {
  test('viewing profiles and logging out leaves no Firestore cache in IndexedDB', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0), makeProfile(1)]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(2);

    // Auth is cleared when the tab closes, so the profile data it unlocked must not outlive it.
    expect(await firestoreDatabases(page)).toEqual([]);

    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: 'Log Out' }).click();
    await expect(page).toHaveURL(/\/login$/);

    expect(await firestoreDatabases(page)).toEqual([]);
  });
});
