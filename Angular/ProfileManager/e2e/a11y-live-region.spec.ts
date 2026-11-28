import type { Page, Route } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

// The result count must be announced to screen readers after each load (WCAG 4.1.3). One polite
// live region does it; the visible count is not live, so nothing is announced twice.
const announcement = (page: Page) => page.locator('main [role="status"][aria-atomic="true"]');
const searchBox = (page: Page) => page.getByRole('textbox', { name: 'Search profiles' });

test.describe('result count announcement', () => {
  test('announces the count after the list loads and after a search narrows it', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0), makeProfile(1), makeProfile(2)]);
    await loginAsAdmin();

    await expect(profileRows(page)).toHaveCount(3);
    await expect(announcement(page)).toHaveText('3 profiles');

    await searchBox(page).fill('M1001');
    await searchBox(page).press('Enter');
    await expect(profileRows(page)).toHaveCount(1);
    await expect(announcement(page)).toHaveText('1 profile');
  });

  test('leaves the no-results message to the empty state instead of announcing it twice', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(1);

    await searchBox(page).fill('M-NOPE');
    await searchBox(page).press('Enter');
    await expect(page.getByText('No profiles found.')).toBeVisible();

    await expect(announcement(page)).toHaveCount(1);
    await expect(announcement(page)).toHaveText('');
    await expect(page.getByRole('status').filter({ hasText: 'No profiles found' })).toHaveCount(1);
  });

  test('does not keep the old count while a new one is loading', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0), makeProfile(1), makeProfile(2)]);
    await loginAsAdmin();
    await expect(announcement(page)).toHaveText('3 profiles');

    const slow = async (route: Route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.continue();
    };
    await page.route(/:runQuery/, slow);
    await searchBox(page).fill('M1002');
    await searchBox(page).press('Enter');

    // While the query is in flight there is nothing stale to announce.
    await expect(announcement(page)).toHaveText('');
    await expect(announcement(page)).toHaveText('1 profile', { timeout: 6000 });
    await page.unroute(/:runQuery/, slow);
  });
});
