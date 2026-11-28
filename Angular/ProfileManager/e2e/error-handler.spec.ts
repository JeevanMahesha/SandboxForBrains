import type { Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, openProfileDrawer, test } from './support/fixtures';

/** Lines the app's central error handler wrote to the console (they all start with this prefix). */
const collectReportedErrors = (page: Page): string[] => {
  const reported: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && message.text().startsWith('[ProfileManager]')) {
      reported.push(message.text());
    }
  });
  return reported;
};

/** Refuses the next Firestore write (Lite sends every write as a REST `:commit`). */
const failNextWrite = (page: Page) =>
  page.route(
    /:commit/,
    (route) =>
      route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 403,
            message: 'Missing or insufficient permissions.',
            status: 'PERMISSION_DENIED',
          },
        }),
      }),
    { times: 1 },
  );

test.describe('central error handler', () => {
  test('a failed save still shows its toast and reports the cause once', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Original Name' })]);
    await loginAsAdmin();
    const reported = collectReportedErrors(page);
    await openProfileDrawer(page, 'Edit');
    await page.locator('#name').fill('Changed Name');
    await failNextWrite(page);

    await page.getByRole('button', { name: 'Update Profile' }).click();

    // The user-facing message is unchanged...
    await expect(page.getByText('Failed to update profile')).toBeVisible();
    // ...and the error behind it is no longer thrown away: it reaches the console exactly once.
    await expect.poll(() => reported.length).toBe(1);
    expect(reported[0]).toContain('Missing or insufficient permissions');
  });

  test('a failed status change reports its cause too', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0, { name: 'Status Subject', profileStatusId: 'NEW' })]);
    await loginAsAdmin();
    const reported = collectReportedErrors(page);
    await failNextWrite(page);

    await page.getByRole('button', { name: 'Change status, currently New' }).first().click();
    await page.getByRole('menuitem', { name: 'Contacted' }).click();

    await expect(page.getByText('Failed to update status')).toBeVisible();
    await expect.poll(() => reported.length).toBe(1);
  });

  test('a normal session logs nothing through the handler', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();
    const reported = collectReportedErrors(page);
    await openProfileDrawer(page, 'View');
    await expect(page.getByRole('heading', { name: 'View Profile' })).toBeVisible();
    expect(reported).toEqual([]);
  });
});
