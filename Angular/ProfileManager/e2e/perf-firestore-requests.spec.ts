import type { Page } from '@playwright/test';
import { PROFILE_STATUS, ZODIAC_LIST } from '../src/app/constant/common.const';
import { makeProfile, seedProfiles } from './support/emulator';
import {
  expect,
  fillWizardProfile,
  openNewProfileWizard,
  pickOption,
  profileRows,
  profilesTotal,
  test,
} from './support/fixtures';

/** How long a confirmed delete stays undoable (ProfilesService.DELETE_UNDO_MS). */
const UNDO_WINDOW_MS = 6000;

const ARIES_LABEL = `${ZODIAC_LIST.aries.tanglish} (${ZODIAC_LIST.aries.english})`;

/**
 * Counts the Firestore requests the app sends. Firestore Lite talks REST, so a page of results is
 * one `:runQuery` and a total is one `:runAggregationQuery`. `docs` is the number of documents the
 * `:runQuery` responses carried, i.e. what the app actually downloaded and was billed to read.
 */
function trackFirestore(page: Page) {
  const stats = { queries: 0, aggregations: 0, docs: 0 };
  page.on('request', (request) => {
    if (request.method() !== 'POST') return;
    if (/:runAggregationQuery/.test(request.url())) stats.aggregations++;
    else if (/:runQuery/.test(request.url())) stats.queries++;
  });
  page.on('response', async (response) => {
    if (!/:runQuery/.test(response.url())) return;
    try {
      const body = (await response.json()) as { document?: unknown }[];
      stats.docs += body.filter((entry) => entry.document).length;
    } catch {
      // A response that is not JSON is not a result page.
    }
  });
  return {
    stats,
    reset() {
      stats.queries = 0;
      stats.aggregations = 0;
      stats.docs = 0;
    },
    /** Waits until the page has gone quiet, so the counters are final. */
    async settle() {
      await page.waitForLoadState('networkidle');
    },
  };
}

const searchBox = (page: Page) => page.getByPlaceholder('Search by full ID or phone');
const pagination = (page: Page) => page.getByRole('navigation', { name: 'pagination' });

const seedMany = (count: number) =>
  seedProfiles(Array.from({ length: count }, (_, index) => makeProfile(index)));

test.describe('Firestore requests', () => {
  test('a search sends one query per searched field and no count', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedMany(3);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(3);
    const requests = trackFirestore(page);
    await requests.settle();
    requests.reset();

    await searchBox(page).fill('M1001');
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profilesTotal(page)).toHaveText(/^1 profile$/);
    await requests.settle();

    // The ID query and the phone query, each once. The search used to run them twice (once to
    // count, once to list) for four queries.
    expect(requests.stats.queries).toBe(2);
    expect(requests.stats.aggregations).toBe(0);
  });

  test('changing page sends one page query and no new count', async ({ page, loginAsAdmin }) => {
    await seedMany(30);
    const requests = trackFirestore(page);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(12);
    await expect(profilesTotal(page)).toHaveText(/^30 profiles$/);
    await requests.settle();
    expect(requests.stats.aggregations).toBe(1);
    expect(requests.stats.queries).toBe(1);

    requests.reset();
    await pagination(page).getByRole('button', { name: 'Go to page 2' }).click();
    await expect(pagination(page).locator('[aria-current="page"]')).toHaveText('2');
    await requests.settle();
    expect(requests.stats.aggregations).toBe(0);
    expect(requests.stats.queries).toBe(1);

    requests.reset();
    await pagination(page).getByRole('button', { name: 'Go to page 1' }).click();
    await expect(pagination(page).locator('[aria-current="page"]')).toHaveText('1');
    await requests.settle();
    expect(requests.stats.aggregations).toBe(0);
    expect(requests.stats.queries).toBe(1);
    await expect(profilesTotal(page)).toHaveText(/^30 profiles$/);
  });

  test('jumping to an unvisited page reads only the pages after the nearest known one', async ({
    page,
    loginAsAdmin,
  }) => {
    // 60 profiles, 5 pages of 12, newest first: page 5 holds profiles 12 down to 1.
    await seedMany(60);
    const requests = trackFirestore(page);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(12);
    await pagination(page).getByRole('button', { name: 'Go to page 2' }).click();
    await expect(pagination(page).locator('[aria-current="page"]')).toHaveText('2');
    await requests.settle();

    requests.reset();
    await pagination(page).getByRole('button', { name: 'Go to page 5' }).click();
    await expect(pagination(page).locator('[aria-current="page"]')).toHaveText('5');
    await expect(profileRows(page)).toHaveCount(12);
    await expect(profileRows(page).first()).toContainText('Seed Profile 12');
    await expect(profileRows(page).last()).toContainText('Seed Profile 01');
    await requests.settle();

    // Pages 3 to 5 (36 documents) from the cursor kept for page 3. It used to download all 60.
    expect(requests.stats.aggregations).toBe(0);
    expect(requests.stats.queries).toBe(1);
    expect(requests.stats.docs).toBe(36);
  });

  test('a confirmed delete recounts nothing and leaves the pages after it correct', async ({
    page,
    loginAsAdmin,
  }) => {
    await page.clock.install();
    // 30 profiles: page 1 is 30..19, page 2 is 18..7, page 3 is 6..1.
    await seedMany(30);
    const requests = trackFirestore(page);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(12);
    await pagination(page).getByRole('button', { name: 'Go to page 2' }).click();
    await expect(profileRows(page).first()).toContainText('Seed Profile 18');

    await profileRows(page)
      .filter({ hasText: 'Seed Profile 10' })
      .getByRole('button', { name: 'Delete' })
      .click();
    await page.locator('app-confirm-dialog').getByRole('button', { name: 'Delete' }).click();
    await expect(profilesTotal(page)).toHaveText(/^29 profiles$/);
    await requests.settle();

    requests.reset();
    await page.clock.fastForward(UNDO_WINDOW_MS + 500);
    // The reload pulls the next profile (06) up into the page.
    await expect(profileRows(page).filter({ hasText: 'Seed Profile 06' })).toHaveCount(1);
    await expect(profileRows(page)).toHaveCount(12);
    await expect(profileRows(page).filter({ hasText: 'Seed Profile 10' })).toHaveCount(0);
    await requests.settle();
    expect(requests.stats.aggregations).toBe(0);
    expect(requests.stats.queries).toBe(1);
    await expect(profilesTotal(page)).toHaveText(/^29 profiles$/);

    // The last page follows on from the reloaded one: 05 to 01, nothing skipped or repeated.
    await pagination(page).getByRole('button', { name: 'Go to page 3' }).click();
    await expect(profileRows(page)).toHaveCount(5);
    await expect(profileRows(page).first()).toContainText('Seed Profile 05');
    await expect(profileRows(page).last()).toContainText('Seed Profile 01');
  });

  test('undoing a delete restores the row and the total without a recount', async ({
    page,
    loginAsAdmin,
  }) => {
    await page.clock.install();
    await seedMany(30);
    const requests = trackFirestore(page);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(12);
    await expect(profilesTotal(page)).toHaveText(/^30 profiles$/);
    await requests.settle();

    await profileRows(page).first().getByRole('button', { name: 'Delete' }).click();
    await page.locator('app-confirm-dialog').getByRole('button', { name: 'Delete' }).click();
    await expect(profilesTotal(page)).toHaveText(/^29 profiles$/);
    await requests.settle();

    requests.reset();
    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(profilesTotal(page)).toHaveText(/^30 profiles$/);
    await expect(profileRows(page)).toHaveCount(12);
    await expect(profileRows(page).first()).toContainText('Seed Profile 30');
    await requests.settle();
    expect(requests.stats.aggregations).toBe(0);
    expect(requests.stats.queries).toBe(1);
  });

  test('saving an edit that cannot change which profiles match does not recount', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedMany(30);
    const requests = trackFirestore(page);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(12);
    await requests.settle();

    await profileRows(page)
      .filter({ hasText: 'Seed Profile 30' })
      .getByRole('button', { name: 'Edit' })
      .click();
    await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
    await page.locator('#name').fill('Renamed Thirty');
    requests.reset();
    await page.getByRole('button', { name: 'Update Profile' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();
    await expect(profileRows(page).first()).toContainText('Renamed Thirty');
    await requests.settle();

    expect(requests.stats.aggregations).toBe(0);
    expect(requests.stats.queries).toBe(1);
    await expect(profilesTotal(page)).toHaveText(/^30 profiles$/);
  });

  test('an edit that changes the status while filtering by status still recounts', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles(Array.from({ length: 3 }, (_, index) => makeProfile(index)));
    await loginAsAdmin();
    await expect(profilesTotal(page)).toHaveText(/^3 profiles$/);
    await page.getByRole('combobox', { name: 'Profile status' }).click();
    await page.getByRole('option', { name: PROFILE_STATUS.NEW, exact: true }).click();
    await expect(profilesTotal(page)).toHaveText(/^3 profiles$/);

    await profileRows(page)
      .filter({ hasText: 'Seed Profile 03' })
      .getByRole('button', { name: 'Edit' })
      .click();
    await pickOption(page, 'hlm-select#profile_status', PROFILE_STATUS.ACCEPTED);
    await page.getByRole('button', { name: 'Update Profile' }).click();
    await expect(page.getByText('Profile updated successfully')).toBeVisible();

    // The profile no longer matches the New filter: it leaves the list and the total drops.
    await expect(profileRows(page)).toHaveCount(2);
    await expect(profilesTotal(page)).toHaveText(/^2 profiles$/);
  });

  test('a created profile shows first and the total includes it', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedMany(30);
    await loginAsAdmin();
    await expect(profilesTotal(page)).toHaveText(/^30 profiles$/);
    await pagination(page).getByRole('button', { name: 'Go to page 2' }).click();
    await expect(profileRows(page).first()).toContainText('Seed Profile 18');

    await openNewProfileWizard(page);
    await fillWizardProfile(page, {
      name: 'Brand New Person',
      mobile: '98765 11111',
      matrimonyId: 'M-NEW-31',
      status: PROFILE_STATUS.NEW,
      zodiac: ARIES_LABEL,
      age: '27',
      state: 'Tamil Nadu',
      city: 'Chennai',
    });
    await page.getByRole('button', { name: 'Create profile' }).click();

    await expect(page.getByText('Profile added successfully')).toBeVisible();
    await expect(profilesTotal(page)).toHaveText(/^31 profiles$/);
    await expect(profileRows(page)).toHaveCount(12);
    await expect(profileRows(page).first()).toContainText('Brand New Person');
    await pagination(page).getByRole('button', { name: 'Go to page 3' }).click();
    // 31 profiles, newest first: page 1 is new + 30..20, page 2 is 19..8, page 3 is 7..1.
    await expect(profileRows(page)).toHaveCount(7);
    await expect(profileRows(page).last()).toContainText('Seed Profile 01');
  });
});
