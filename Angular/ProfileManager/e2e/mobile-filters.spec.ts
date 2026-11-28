import type { Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, profilesTotal, sheetStatusButton, test } from './support/fixtures';

// The phone toolbar (< 768px) hides the desktop selects: sort, status and star-match score live in
// the bottom "Filters" sheet, active filters show as removable chips and a count badge, and the
// page size sits in the pager footer. This spec covers that sheet end to end.
test.use({ viewport: { width: 390, height: 844 } });

const filtersButton = (page: Page) =>
  page.locator('app-toolbar').getByRole('button', { name: /^Filters/ });
const sheet = (page: Page) => page.getByRole('dialog', { name: 'Filters' });
const activeFilters = (page: Page) => page.getByRole('group', { name: 'Active filters' });

/**
 * Opens the sheet and waits until its content is shown. The dialog's own host element has no box
 * of its own (Playwright reports it as hidden even while open), so "open" is the heading being
 * visible and "closed" is the dialog leaving the DOM, never `toBeHidden()` on the host.
 */
async function openSheet(page: Page) {
  await filtersButton(page).click();
  await expect(sheet(page).getByRole('heading', { name: 'Filters' })).toBeVisible();
  return sheet(page);
}

/** Seeds one profile per scenario field so every sheet control visibly changes the list. */
async function seedMixed() {
  await seedProfiles([
    makeProfile(0, { name: 'Oldest Accepted', profileStatusId: 'ACCEPTED', starMatchScore: 6 }),
    makeProfile(1, { name: 'Middle New', profileStatusId: 'NEW', starMatchScore: 8 }),
    makeProfile(2, { name: 'Newest Accepted', profileStatusId: 'ACCEPTED', starMatchScore: 8 }),
  ]);
}

test.describe('phone Filters sheet: open, close and focus', () => {
  test('opens as a dialog with focus inside, closes with Esc and returns focus to Filters', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedMixed();
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(3);

    const dialog = await openSheet(page);
    await expect
      .poll(() => dialog.evaluate((el) => el.contains(document.activeElement)))
      .toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(filtersButton(page)).toBeFocused();
  });

  test('the "Show N profiles" button closes it and its label follows the filtered total', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedMixed();
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(3);

    const dialog = await openSheet(page);
    await expect(dialog.getByRole('button', { name: 'Show 3 profiles' })).toBeVisible();

    await sheetStatusButton(page, 'New').click();
    await expect(profileRows(page)).toHaveCount(1);
    // Singular once exactly one profile matches.
    await dialog.getByRole('button', { name: 'Show 1 profile', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(filtersButton(page)).toBeFocused();
  });

  test('tapping outside the sheet closes it and keeps the chosen filter', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedMixed();
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(3);

    const dialog = await openSheet(page);
    await sheetStatusButton(page, 'Accepted').click();
    await expect(profileRows(page)).toHaveCount(2);

    // The backdrop covers the page above the bottom sheet.
    await page.mouse.click(195, 40);
    await expect(dialog).toHaveCount(0);
    await expect(profileRows(page)).toHaveCount(2);
  });
});

test.describe('phone Filters sheet: keyboard', () => {
  // Esc closes the sheet however many of its selects were used, as long as the listbox is gone. Esc
  // pressed during the listbox's own exit animation (~150 ms after picking an option) is swallowed:
  // Brain keeps that overlay topmost while it animates out and nobody handles the key. That window
  // is inside Spartan, so each test waits for the listbox to leave the DOM before pressing Esc.
  test('Esc closes the sheet after the Sort select was used', async ({ page, loginAsAdmin }) => {
    await seedMixed();
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(3);

    const dialog = await openSheet(page);
    await dialog.getByRole('combobox', { name: 'Sort' }).click();
    await page.getByRole('option', { name: 'Oldest First', exact: true }).click();
    await expect(page.getByRole('listbox')).toHaveCount(0);

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

  test('Esc closes the sheet after the Star Match Score select was used', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedMixed();
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(3);

    const dialog = await openSheet(page);
    await dialog.getByRole('combobox', { name: 'Star match score' }).click();
    await page.getByRole('option', { name: '8', exact: true }).click();
    await expect(page.getByRole('listbox')).toHaveCount(0);

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

  test('Esc closes the sheet after both selects were used, and again after reopening it', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedMixed();
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(3);

    let dialog = await openSheet(page);
    await dialog.getByRole('combobox', { name: 'Sort' }).click();
    await page.getByRole('option', { name: 'Oldest First', exact: true }).click();
    await expect(page.getByRole('listbox')).toHaveCount(0);
    await dialog.getByRole('combobox', { name: 'Star match score' }).click();
    await page.getByRole('option', { name: '8', exact: true }).click();
    await expect(page.getByRole('listbox')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(filtersButton(page)).toBeFocused();

    // A second visit: the selects keep working and Esc still closes the sheet.
    dialog = await openSheet(page);
    await dialog.getByRole('combobox', { name: 'Sort' }).click();
    await page.getByRole('option', { name: 'Newest First', exact: true }).click();
    await expect(page.getByRole('listbox')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });
});

test.describe('phone Filters sheet: controls change the list', () => {
  test('Sort switches to oldest first and Clear puts it back', async ({ page, loginAsAdmin }) => {
    await seedMixed();
    await loginAsAdmin();
    const rows = profileRows(page);
    await expect(rows.first()).toContainText('Newest Accepted');

    const dialog = await openSheet(page);
    // Newest first is the default, so there is nothing to clear yet.
    await expect(dialog.getByRole('button', { name: 'Clear' })).toBeDisabled();

    await dialog.getByRole('combobox', { name: 'Sort' }).click();
    await page.getByRole('option', { name: 'Oldest First', exact: true }).click();
    await expect(rows.first()).toContainText('Oldest Accepted');
    await expect(rows.last()).toContainText('Newest Accepted');
    // A non-default sort is not a "filter" (no chip), but Clear becomes useful.
    await expect(activeFilters(page)).toHaveCount(0);
    await expect(dialog.getByRole('button', { name: 'Clear' })).toBeEnabled();

    await dialog.getByRole('button', { name: 'Clear' }).click();
    await expect(rows.first()).toContainText('Newest Accepted');
    await expect(dialog.getByRole('combobox', { name: 'Sort' })).toHaveText('Newest First');
    await expect(dialog.getByRole('button', { name: 'Clear' })).toBeDisabled();

    // Closed again, the button reports no active filter: sort alone never counts as one.
    await dialog.getByRole('button', { name: 'Show 3 profiles' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(filtersButton(page)).toHaveAccessibleName('Filters');
  });

  test('Star Match Score filters the list, shows a chip and a badge, and the chip removes it', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedMixed();
    await loginAsAdmin();
    const rows = profileRows(page);
    await expect(rows).toHaveCount(3);
    await expect(activeFilters(page)).toHaveCount(0);

    const dialog = await openSheet(page);
    await dialog.getByRole('combobox', { name: 'Star match score' }).click();
    await page.getByRole('option', { name: '8', exact: true }).click();
    await expect(rows).toHaveCount(2);
    await expect(rows.first()).toContainText('Newest Accepted');
    await expect(rows.last()).toContainText('Middle New');
    await dialog.getByRole('button', { name: /^Show 2 profiles/ }).click();

    // One active filter: the button's name carries the count, the chip is removable.
    await expect(filtersButton(page)).toHaveAccessibleName('Filters, 1 active');
    await expect(filtersButton(page)).toContainText('1');
    await expect(activeFilters(page)).toBeVisible();
    await activeFilters(page).getByRole('button', { name: 'Remove filter Score 8' }).click();

    await expect(rows).toHaveCount(3);
    await expect(activeFilters(page)).toHaveCount(0);
    await expect(filtersButton(page)).toHaveAccessibleName('Filters');
  });

  test('status and score combine, show two chips and a badge of 2, and each chip removes only its own filter', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedMixed();
    await loginAsAdmin();
    const rows = profileRows(page);
    await expect(rows).toHaveCount(3);

    const dialog = await openSheet(page);
    await sheetStatusButton(page, 'Accepted').click();
    await dialog.getByRole('combobox', { name: 'Star match score' }).click();
    await page.getByRole('option', { name: '8', exact: true }).click();
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Newest Accepted');
    await dialog.getByRole('button', { name: /^Show \d+ profiles?$/ }).click();
    await expect(dialog).toHaveCount(0);

    await expect(filtersButton(page)).toHaveAccessibleName('Filters, 2 active');
    const chips = activeFilters(page);
    await expect(chips.getByRole('button')).toHaveCount(2);

    await chips.getByRole('button', { name: 'Remove filter Accepted' }).click();
    // Only the status goes: the score filter still narrows to the two score-8 profiles.
    await expect(rows).toHaveCount(2);
    await expect(filtersButton(page)).toHaveAccessibleName('Filters, 1 active');
    await expect(chips.getByRole('button', { name: 'Remove filter Score 8' })).toBeVisible();
  });

  test('Clear in the sheet resets status, score and sort but keeps the search text', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedMixed();
    await loginAsAdmin();
    const rows = profileRows(page);
    await expect(rows).toHaveCount(3);

    const dialog = await openSheet(page);
    await sheetStatusButton(page, 'Accepted').click();
    await dialog.getByRole('combobox', { name: 'Sort' }).click();
    await page.getByRole('option', { name: 'Oldest First', exact: true }).click();
    await expect(rows).toHaveCount(2);
    await expect(rows.first()).toContainText('Oldest Accepted');
    await dialog.getByRole('button', { name: /^Show \d+ profiles?$/ }).click();
    await expect(dialog).toHaveCount(0);

    // Search is on the toolbar, not in the sheet; Clear must not wipe it. M1001 is "Middle New".
    const search = page.getByPlaceholder('Search by full ID or phone');
    await search.fill('M1000');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Oldest Accepted');

    await openSheet(page);
    await dialog.getByRole('button', { name: 'Clear' }).click();
    await expect(sheetStatusButton(page, 'All')).toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.getByRole('combobox', { name: 'Sort' })).toHaveText('Newest First');
    await expect(dialog.getByRole('button', { name: 'Clear' })).toBeDisabled();
    await expect(search).toHaveValue('M1000');
    await expect(rows).toHaveCount(1);
  });

  test('chosen filters are still selected when the sheet is reopened', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedMixed();
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(3);

    let dialog = await openSheet(page);
    await sheetStatusButton(page, 'Accepted').click();
    await dialog.getByRole('combobox', { name: 'Sort' }).click();
    await page.getByRole('option', { name: 'Oldest First', exact: true }).click();
    await dialog.getByRole('combobox', { name: 'Star match score' }).click();
    await page.getByRole('option', { name: '6', exact: true }).click();
    await dialog.getByRole('button', { name: /^Show \d+ profiles?$/ }).click();
    await expect(dialog).toHaveCount(0);
    await expect(profileRows(page)).toHaveCount(1);

    dialog = await openSheet(page);
    await expect(sheetStatusButton(page, 'Accepted')).toHaveAttribute('aria-pressed', 'true');
    await expect(sheetStatusButton(page, 'All')).toHaveAttribute('aria-pressed', 'false');
    await expect(dialog.getByRole('combobox', { name: 'Sort' })).toHaveText('Oldest First');
    await expect(dialog.getByRole('combobox', { name: 'Star match score' })).toHaveText('6');
    await expect(dialog.getByRole('button', { name: 'Clear' })).toBeEnabled();
  });
});

test.describe('phone pager page size', () => {
  test('the page-size select in the pager footer shows more rows on one page', async ({
    page,
    loginAsAdmin,
  }) => {
    // 14 profiles: the phone list pages at 12, so 2 spill onto page 2.
    await seedProfiles(Array.from({ length: 14 }, (_, index) => makeProfile(index)));
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(12);
    await expect(profilesTotal(page)).toContainText('14');

    const pager = page.locator('app-profiles-list hlm-numbered-pagination');
    await pager.getByRole('combobox').click();
    await page.getByRole('option', { name: '24', exact: true }).click();

    await expect(profileRows(page)).toHaveCount(14);
    await expect(pager.getByRole('combobox')).toHaveText('24');
    // One page now holds everything, so no page 2 link remains.
    await expect(pager.getByRole('link', { name: 'Go to page 2' })).toHaveCount(0);
  });
});
