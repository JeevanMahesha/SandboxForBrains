import { PROFILE_STATUS } from '../src/app/constant/common.const';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, profilesTotal, selectStatusFilter, test } from './support/fixtures';

test.describe('filtering and pagination', () => {
  test.beforeEach(async () => {
    // 14 profiles: 8 NEW and 6 ACCEPTED. Page size is 12, so page 2 holds the last 2.
    await seedProfiles(
      Array.from({ length: 14 }, (_, index) =>
        makeProfile(index, { profileStatusId: index < 8 ? 'NEW' : 'ACCEPTED' }),
      ),
    );
  });

  test('pages through the list', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();

    await expect(profileRows(page)).toHaveCount(12);
    await expect(profilesTotal(page)).toHaveText(/^14 profiles$/);

    const pagination = page.getByRole('navigation', { name: 'pagination' });
    await pagination.getByText('2', { exact: true }).click();

    await expect(profileRows(page)).toHaveCount(2);
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('2');
  });

  test('pages through the list using only the keyboard', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(12);

    const pagination = page.getByRole('navigation', { name: 'pagination' });

    // Focus directly rather than tabbing through the whole toolbar first: that would make this
    // test break on any unrelated toolbar change. What matters here is that the control itself
    // is reachable by keyboard and responds to Enter/Space, not the page's full tab order.
    const pageTwoLink = pagination.getByRole('button', { name: 'Go to page 2' });
    await pageTwoLink.focus();
    await expect(pageTwoLink).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(profileRows(page)).toHaveCount(2);
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('2');

    const previousLink = pagination.getByRole('button', { name: 'Go to previous page' });
    await previousLink.focus();
    await page.keyboard.press('Space');

    await expect(profileRows(page)).toHaveCount(12);
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('1');
  });

  test('filters by profile status', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(12);

    await selectStatusFilter(page, PROFILE_STATUS.ACCEPTED);

    await expect(profileRows(page)).toHaveCount(6);
    await expect(profilesTotal(page)).toHaveText(/^6 profiles$/);
    for (const row of await profileRows(page).all()) {
      await expect(row).toContainText(PROFILE_STATUS.ACCEPTED);
    }
  });
});

test.describe('profile list ordering', () => {
  test('always sorts rejected profiles to the end, regardless of date', async ({
    page,
    loginAsAdmin,
  }) => {
    // Rejected is seeded newest, so the default "Newest First" sort would put it first; the app's
    // sortWithRejectedLast rule must override that and push it to the end instead.
    await seedProfiles([
      makeProfile(0, { name: 'Oldest Accepted', profileStatusId: 'ACCEPTED' }),
      makeProfile(1, { name: 'Middle New' }),
      makeProfile(2, { name: 'Newest Rejected', profileStatusId: 'REJECTED' }),
    ]);
    await loginAsAdmin();

    const rows = profileRows(page);
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0)).toContainText('Middle New');
    await expect(rows.nth(1)).toContainText('Oldest Accepted');
    await expect(rows.nth(2)).toContainText('Newest Rejected');
  });
});
