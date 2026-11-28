import { makeProfile, seedProfiles } from './support/emulator';
import { expect, openNewProfileWizard, profileRows, test } from './support/fixtures';

// Every page needs one <main> landmark, one h1 and a title that names it (WCAG 2.4.1, 1.3.1, 2.4.2).
const TITLE = {
  login: 'Login · ProfileManager',
  list: 'Profiles · ProfileManager',
  wizard: 'Add New Profile · ProfileManager',
};

test.describe('page landmarks, headings and titles', () => {
  test('login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Login');
    await expect(page).toHaveTitle(TITLE.login);
  });

  test('profiles list page, with card names one level below the h1', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0), makeProfile(1)]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(2);

    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Profiles');
    await expect(page).toHaveTitle(TITLE.list);
    // No skipped level: the card names are h2 (they were h3 straight under no h1 at all).
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(2);
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(0);
  });

  test('create wizard page', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);

    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Add New Profile');
    await expect(page).toHaveTitle(TITLE.wizard);
  });

  test('the title follows the page when navigating list → wizard → back', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await expect(page).toHaveTitle(TITLE.list);

    await openNewProfileWizard(page);
    await expect(page).toHaveTitle(TITLE.wizard);

    await page.getByRole('link', { name: 'Back to profiles' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(TITLE.list);
  });
});
