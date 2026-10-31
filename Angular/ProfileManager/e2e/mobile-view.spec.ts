import { makeProfile, seedProfiles } from './support/emulator';
import { expect, test } from './support/fixtures';

// Every other spec runs at the default Desktop Chrome viewport, where `md:` classes keep the
// mobile card layout (`profiles-list-mobile-view`) hidden entirely. Narrowing just this file
// below the `md` breakpoint (768px) is what actually renders it, so this is the only coverage
// the mobile view gets at all.
test.use({ viewport: { width: 390, height: 844 } });

test.describe('mobile view', () => {
  test('renders the mobile cards instead of the desktop grid, and both open the profile drawer', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Mobile Card Profile' })]);
    await loginAsAdmin();

    const card = page.getByTestId('profile-card').first();
    await expect(card).toBeVisible();
    await expect(card).toContainText('Mobile Card Profile');
    // The desktop card grid must not also be in the DOM at this width (cards share one test id).
    await expect(page.getByTestId('profile-card')).toHaveCount(1);
    await expect(page.locator('app-profiles-list-desktop-view')).toHaveCount(0);

    // Tapping the card itself opens the read-only drawer.
    await card.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'View Profile' })).toBeVisible();
    // The sheet has both a footer "Close" button and an icon-only close control sharing the
    // same accessible name — scope to the footer one to avoid a strict-mode violation.
    await dialog.getByRole('button', { name: 'Close' }).first().click();

    // The card's own kebab menu opens Edit without also triggering the card's click handler.
    await card.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await expect(dialog.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
  });

  test('shows "No profiles found." when a search matches nothing', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Mobile Present' })]);
    await loginAsAdmin();
    await expect(page.getByTestId('profile-card')).toHaveCount(1);

    // On mobile the search box lives inside the "Filters" bottom sheet.
    await page.getByRole('button', { name: 'Filters' }).click();
    const sheetSearch = page.getByRole('dialog', { name: 'Filters' }).getByRole('textbox');
    await sheetSearch.click();
    await sheetSearch.pressSequentially('+91 99999 99999');
    await expect(page.getByText('No profiles found.')).toBeVisible();
    await expect(page.getByTestId('profile-card')).toHaveCount(0);
  });
});
