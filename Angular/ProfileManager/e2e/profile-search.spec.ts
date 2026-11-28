import type { Page, Route } from '@playwright/test';
import { toCanonicalMobileNumber } from '../src/app/utils/mobile-number.util';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, profilesTotal, selectStatusFilter, test } from './support/fixtures';

// The toolbar search box (`filterForm.searchQuery` in toolbar.ts) debounces input by 350ms
// before it reaches `ProfilesService.filterOptions`, so every assertion below relies on
// Playwright's auto-retrying `expect` rather than a fixed wait.
function searchBox(page: Page) {
  return page.getByPlaceholder('Search by full ID or phone');
}

// Firestore's REST count endpoint: `.../documents:runAggregationQuery?key=...`.
const AGGREGATION_URL = /:runAggregationQuery/;

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

  test('finds a profile by phone typed with spaces, a +91 prefix or no country code', async ({
    page,
    loginAsAdmin,
  }) => {
    const target = makeProfile(0, { name: 'Format Target' });
    await seedProfiles([target, makeProfile(1, { name: 'Format Other' })]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(2);

    const national = target.mobileNumber.replace('+91', '');
    const formats = [
      `+91 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`,
      `+91-${national.slice(0, 5)}-${national.slice(5)}`,
      `91 ${national}`,
      `${national.slice(0, 5)} ${national.slice(5)}`,
      national,
    ];

    for (const input of formats) {
      expect(toCanonicalMobileNumber(input), input).toBe(target.mobileNumber);
      await searchBox(page).fill(input);
      await expect(profileRows(page), input).toHaveCount(1);
      await expect(profileRows(page).first()).toContainText('Format Target');
    }
  });

  test('shows a "No profiles found." state when nothing matches, and recovers when cleared', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Present Profile' })]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(1);
    await expect(page.getByText('No profiles found.')).toHaveCount(0);

    // A well-formed phone number that no seeded profile has.
    await searchBox(page).fill('+91 99999 99999');
    await expect(page.getByText('No profiles found.')).toBeVisible();
    await expect(profileRows(page)).toHaveCount(0);
    await expect(profilesTotal(page)).toHaveText(/^0 profiles$/);
    await expect(page.getByRole('alert')).toHaveCount(0);

    await searchBox(page).fill('');
    await expect(profileRows(page)).toHaveCount(1);
    await expect(page.getByText('No profiles found.')).toHaveCount(0);
  });

  test('explains that search needs the full value when a partial search finds nothing', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([
      makeProfile(0, { name: 'Search Target', matrimonyId: 'SEARCH-001' }),
      makeProfile(1, { name: 'Accepted One', matrimonyId: 'ACC-001', profileStatusId: 'ACCEPTED' }),
    ]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(2);

    const hint = page.getByText('Search matches the full Matrimony ID or phone number exactly.');
    await expect(searchBox(page)).toHaveAttribute('placeholder', 'Search by full ID or phone');

    // A partial id finds nothing, and the empty state says why.
    await searchBox(page).fill('SEARCH-0');
    await expect(page.getByText('No profiles found.')).toBeVisible();
    await expect(hint).toBeVisible();

    // The exact value still finds it, with no hint.
    await searchBox(page).fill('SEARCH-001');
    await expect(profileRows(page)).toHaveCount(1);
    await expect(hint).toHaveCount(0);

    // An empty result caused only by a status filter is not about search: no search hint.
    await searchBox(page).fill('');
    await selectStatusFilter(page, 'Rejected');
    await expect(page.getByText('No profiles found.')).toBeVisible();
    await expect(hint).toHaveCount(0);
  });

  test('shows the error message with Retry when the query fails, and Retry recovers', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Retry Profile' })]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(1);

    // Changing the sort order (default is Newest First) changes the filter key, so the loader recounts through the
    // aggregation endpoint. Failing that one call (the shape Firestore uses for a missing
    // composite index) puts the resource into its error state. The emulator never enforces
    // indexes, so this is the only way to reach that state in e2e.
    const failAggregation = (route: Route) =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 400,
            status: 'FAILED_PRECONDITION',
            message: 'The query requires an index.',
          },
        }),
      });
    await page.route(AGGREGATION_URL, failAggregation);

    await page.getByRole('combobox').filter({ hasText: 'Newest First' }).click();
    await page.getByRole('option', { name: 'Oldest First', exact: true }).click();

    const alert = page.getByRole('alert');
    await expect(alert).toContainText('Something went wrong while loading profiles.');
    await expect(alert).toContainText('The query requires an index.');
    await expect(page.locator('nav[aria-label="pagination"]')).toHaveCount(0);
    // A failed load is not an empty list: no "No profiles yet / Add Profile" under the error.
    await expect(page.getByText('No profiles yet')).toHaveCount(0);
    await expect(page.getByText('No profiles found.')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Add Profile' }).first()).toBeVisible();

    await page.unroute(AGGREGATION_URL, failAggregation);
    await alert.getByRole('button', { name: 'Retry' }).click();

    await expect(alert).toHaveCount(0);
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profileRows(page).first()).toContainText('Retry Profile');
  });

  test.describe('debounce (fake clock)', () => {
    // SEARCH_DEBOUNCE_MS in toolbar.ts.
    const DEBOUNCE_MS = 350;

    /** Counts the Firestore `:runQuery` calls the page sends. One search is one per field. */
    const trackQueries = (page: Page) => {
      let count = 0;
      page.on('request', (request) => {
        if (request.method() === 'POST' && /:runQuery/.test(request.url())) count++;
      });
      return { count: () => count };
    };

    /**
     * Takes over the page's timers after login (login and the Firebase token run on real time) and
     * freezes them, so only `clock.runFor` moves time. Angular's zoneless scheduler also runs on
     * timers, so anything that has to render needs the clock advanced after it.
     */
    const freezeClock = async (page: Page) => {
      await page.clock.install();
      await page.clock.pauseAt(new Date(Date.now() + 10_000));
    };

    /** Advances the clock in small steps until `done()`; returns how many ms that took. */
    const advanceUntil = async (page: Page, done: () => boolean, stepMs = 10, maxSteps = 30) => {
      let elapsed = 0;
      for (let step = 0; step < maxSteps && !done(); step++) {
        await page.clock.runFor(stepMs);
        elapsed += stepMs;
        // Let the request this step started leave the page before it is counted.
        await page.waitForLoadState('networkidle');
      }
      return elapsed;
    };

    /** Advances the clock until the list has `rows` rows (rendering runs on the fake timers). */
    const expectRows = (page: Page, rows: number) =>
      expect
        .poll(async () => {
          await page.clock.runFor(25);
          return profileRows(page).count();
        })
        .toBe(rows);

    const seedAndLogin = async (page: Page, loginAsAdmin: () => Promise<void>) => {
      await seedProfiles([
        makeProfile(0, { name: 'Enter Target', matrimonyId: 'ENTER-001' }),
        makeProfile(1, { name: 'Enter Other', matrimonyId: 'ENTER-002' }),
      ]);
      await loginAsAdmin();
      await expect(profileRows(page)).toHaveCount(2);
      await page.waitForLoadState('networkidle');
    };

    test('sends nothing before 350 ms after the last keystroke, then exactly one search', async ({
      page,
      loginAsAdmin,
    }) => {
      await seedAndLogin(page, loginAsAdmin);
      await freezeClock(page);
      const queries = trackQueries(page);

      await searchBox(page).fill('ENTER-001');
      await page.clock.runFor(DEBOUNCE_MS - 50);
      expect(queries.count()).toBe(0);

      // Crossing the 350 ms mark runs the search once: one query per searched field (ID, phone).
      await page.clock.runFor(100);
      await expect.poll(() => queries.count()).toBe(2);
      await expectRows(page, 1);
      await expect(profileRows(page).first()).toContainText('Enter Target');

      // Nothing else follows (no second, delayed search).
      await page.clock.runFor(2 * DEBOUNCE_MS);
      await page.waitForLoadState('networkidle');
      expect(queries.count()).toBe(2);
    });

    test('typing again inside the window restarts the 350 ms wait', async ({
      page,
      loginAsAdmin,
    }) => {
      await seedAndLogin(page, loginAsAdmin);
      await freezeClock(page);
      const queries = trackQueries(page);

      await searchBox(page).fill('ENTER-00');
      await page.clock.runFor(DEBOUNCE_MS - 50);
      await searchBox(page).fill('ENTER-001');
      // 600 ms after the first keystroke, but only 300 ms after the last one.
      await page.clock.runFor(DEBOUNCE_MS - 50);
      expect(queries.count()).toBe(0);

      await page.clock.runFor(100);
      await expect.poll(() => queries.count()).toBe(2);
      await expectRows(page, 1);
      // The stale first value never got a search of its own.
      await page.clock.runFor(2 * DEBOUNCE_MS);
      await page.waitForLoadState('networkidle');
      expect(queries.count()).toBe(2);
    });

    test('Enter searches immediately, without waiting for the debounce', async ({
      page,
      loginAsAdmin,
    }) => {
      await seedAndLogin(page, loginAsAdmin);
      await freezeClock(page);
      const queries = trackQueries(page);

      await searchBox(page).fill('ENTER-001');
      await page.clock.runFor(80);
      expect(queries.count()).toBe(0);

      await searchBox(page).press('Enter');
      const elapsed = await advanceUntil(page, () => queries.count() >= 2);
      expect(queries.count()).toBe(2);
      // Far below the debounce: it was Enter that searched, not the timer.
      expect(80 + elapsed).toBeLessThan(DEBOUNCE_MS);
      await expectRows(page, 1);
      await expect(profileRows(page).first()).toContainText('Enter Target');

      // The pending debounce does not search a second time when it finally runs.
      await page.clock.runFor(2 * DEBOUNCE_MS);
      await page.waitForLoadState('networkidle');
      expect(queries.count()).toBe(2);
    });

    test('clearing the box restores the list immediately, not after the debounce', async ({
      page,
      loginAsAdmin,
    }) => {
      await seedAndLogin(page, loginAsAdmin);
      await searchBox(page).fill('ENTER-001');
      await searchBox(page).press('Enter');
      await expect(profileRows(page)).toHaveCount(1);
      await page.waitForLoadState('networkidle');

      await freezeClock(page);
      const queries = trackQueries(page);
      await searchBox(page).fill('');
      const elapsed = await advanceUntil(page, () => queries.count() > 0);
      expect(queries.count()).toBeGreaterThan(0);
      expect(elapsed).toBeLessThan(DEBOUNCE_MS);
      await expectRows(page, 2);
    });
  });

  test('shows a spinner inside the search box while the search query is loading', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { matrimonyId: 'SPIN-001' })]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(1);

    const slow = async (route: Route) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await route.continue();
    };
    await page.route(/runQuery/, slow);
    const spinner = page.getByRole('status', { name: 'Searching' });
    await expect(spinner).toHaveCount(0);
    await searchBox(page).fill('SPIN-001');
    await searchBox(page).press('Enter');
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveCount(0, { timeout: 5000 });
    await page.unroute(/runQuery/, slow);
    await expect(profileRows(page)).toHaveCount(1);
  });
});
