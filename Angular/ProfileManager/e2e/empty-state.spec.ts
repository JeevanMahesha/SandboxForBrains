import type { Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profilesTotal, test } from './support/fixtures';

/** The first-profile prompt shown when no profile exists at all (not the "nothing matches" one). */
const firstProfilePrompt = (page: Page) =>
  page.getByRole('status').filter({ hasText: 'No profiles yet' });

test.describe('empty profiles list', () => {
  test('invites the admin to add a first profile and the button opens the wizard', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await expect(profilesTotal(page)).toHaveText(/^0 profiles$/);

    const prompt = firstProfilePrompt(page);
    await expect(prompt).toBeVisible();
    await expect(
      prompt.getByText('Add your first profile to start tracking matches.'),
    ).toBeVisible();
    // This is the "no data" variant, not the "nothing matches" one.
    await expect(page.getByText('No profiles found.')).toHaveCount(0);
    await expect(prompt.getByRole('button', { name: 'Clear filters' })).toHaveCount(0);

    await prompt.getByRole('button', { name: 'Add Profile' }).click();

    await expect(page).toHaveURL(/\/profiles\/new$/);
    await expect(page.getByRole('heading', { name: 'Add New Profile' })).toBeVisible();
  });

  test('the first-profile button is reachable and works on a phone', async ({
    page,
    loginAsAdmin,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsAdmin();

    const prompt = firstProfilePrompt(page);
    await expect(prompt).toBeVisible();
    const button = prompt.getByRole('button', { name: 'Add Profile' });
    await expect(button).toBeInViewport();
    await button.click();

    await expect(page).toHaveURL(/\/profiles\/new$/);
    await expect(page.getByRole('heading', { name: 'Add New Profile' })).toBeVisible();
  });

  test('is gone as soon as a profile exists', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();

    await expect(profilesTotal(page)).toHaveText(/^1 profile$/);
    await expect(page.getByText('No profiles yet')).toHaveCount(0);
  });
});
