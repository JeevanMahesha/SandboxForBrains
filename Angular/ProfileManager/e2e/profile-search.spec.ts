import type { Page } from '@playwright/test';
import { toCanonicalMobileNumber } from '../src/app/utils/mobile-number.util';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

// The toolbar search box (`filterForm.searchQuery` in toolbar.ts) debounces input by 800ms
// before it reaches `ProfilesService.filterOptions`, so every assertion below relies on
// Playwright's auto-retrying `expect` rather than a fixed wait.
function searchBox(page: Page) {
  return page.getByPlaceholder('Search by ID or phone');
}

test.describe('toolbar search', () => {
  test('narrows the list by exact matrimonyId, and clearing it restores the full list', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([
      makeProfile(0, { name: 'Search Target', matrimonyId: 'SEARCH-001' }),
      makeProfile(1, { name: 'Other Profile', matrimonyId: 'SEARCH-002' }),
    ]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(2);

    await searchBox(page).fill('SEARCH-001');
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profileRows(page).first()).toContainText('Search Target');

    // matrimonyId search is an exact match (`where('matrimonyId', '==', ...)`), not a prefix
    // or substring search — a partial id must not match anything.
    await searchBox(page).fill('SEARCH-00');
    await expect(profileRows(page)).toHaveCount(0);

    await searchBox(page).fill('');
    await expect(profileRows(page)).toHaveCount(2);
  });

  test('narrows the list by phone number typed in a non-canonical format', async ({
    page,
    loginAsAdmin,
  }) => {
    // Defaults from makeProfile give each profile a distinct canonical ("+91XXXXXXXXXX") mobile
    // number, so seeding index 0 is enough to get a value to search for and index 1 to prove
    // the other profile is excluded.
    const target = makeProfile(0, { name: 'Phone Target' });
    await seedProfiles([target, makeProfile(1, { name: 'Other Phone' })]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(2);

    // Rewrite the stored canonical number ("+919876543200") into the trunk-prefix format
    // ("098765 43200") that mobile-number.util.ts also accepts on create/edit, to prove the
    // search box canonicalizes its input the same way before querying `mobileNumber`.
    const national = target.mobileNumber.replace('+91', '');
    const nonCanonicalInput = `0${national.slice(0, 5)} ${national.slice(5)}`;
    // Guards the test itself: if this no longer canonicalizes to the seeded number, the
    // fixture data (or mobile-number.util.ts) changed, not the search feature under test.
    expect(toCanonicalMobileNumber(nonCanonicalInput)).toBe(target.mobileNumber);

    await searchBox(page).fill(nonCanonicalInput);
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profileRows(page).first()).toContainText('Phone Target');
    await expect(profileRows(page).first()).toContainText(target.mobileNumber);
  });
});
