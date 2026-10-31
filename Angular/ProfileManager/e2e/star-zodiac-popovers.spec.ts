import { STAR_SCORES, ZODIAC_LIST } from '../src/app/constant/common.const';
import { expect, test } from './support/fixtures';

// These are the toolbar's reference popovers (`app-zodiac-signs` / `app-star-match`). On
// desktop/tablet they open from the "Zodiac signs" / "Preferred star" buttons next to "Add
// Profile"; on phones they open (as bottom sheets) from the "More actions" menu. They are
// read-only lookups — not form controls — so there is nothing here to "select": the Zodiac
// Signs popover lists every sign with its compatible stars, and the Preferred Star popover lists
// the stars grouped by score, highest score first. Neither is wired to the profile drawer's own
// (unrelated) `hlm-select#zodiac_sign`/`#star` fields, which are covered in the create/view specs.

/** Stars grouped by score, highest first, derived from STAR_SCORES the way the popover does. */
function expectedStarGroups(): { score: number; stars: string[] }[] {
  const groups = new Map<number, string[]>();
  for (const [star, score] of Object.entries(STAR_SCORES)) {
    groups.set(score, [...(groups.get(score) ?? []), star]);
  }
  return [...groups.entries()]
    .map(([score, stars]) => ({ score, stars }))
    .sort((a, b) => b.score - a.score);
}

test.describe('star match / zodiac signs popovers', () => {
  test('Zodiac Signs popover lists every sign with its compatible stars, and Escape dismisses it', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();

    await page.locator('app-toolbar').getByRole('button', { name: 'Zodiac signs' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Zodiac Signs' })).toBeVisible();

    // Every sign in ZODIAC_LIST renders as one tile labelled "Tanglish (English)", each showing
    // its own compatible stars.
    const tiles = dialog.getByRole('listitem');
    await expect(tiles).toHaveCount(Object.keys(ZODIAC_LIST).length);
    for (const sign of Object.values(ZODIAC_LIST)) {
      const tile = tiles.filter({ hasText: `${sign.tanglish} (${sign.english})` });
      await expect(tile).toHaveCount(1);
      for (const star of sign.stars) {
        await expect(tile.getByText(star, { exact: true })).toBeVisible();
      }
    }

    // Dismiss without "selecting" anything (there is nothing to select) and confirm the rest of
    // the toolbar is unaffected.
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(
      page.locator('app-toolbar').getByRole('button', { name: 'Add Profile' }),
    ).toBeVisible();
  });

  test('Preferred Star popover groups stars by score, highest first, and closes on outside click', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();

    await page.locator('app-toolbar').getByRole('button', { name: 'Preferred star' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Preferred Star' })).toBeVisible();

    const expected = expectedStarGroups();
    const groups = dialog.getByRole('listitem');
    await expect(groups).toHaveCount(expected.length);

    // Group order is score descending, and every group lists exactly its own stars.
    for (const [index, { score, stars }] of expected.entries()) {
      const group = groups.nth(index);
      await expect(group).toContainText(String(score));
      await expect(group).toContainText(`${stars.length} ${stars.length === 1 ? 'star' : 'stars'}`);
      for (const star of stars) {
        await expect(group.getByText(star, { exact: true })).toBeVisible();
      }
    }
    // Every star appears exactly once across all groups.
    for (const star of Object.keys(STAR_SCORES)) {
      await expect(dialog.getByText(star, { exact: true })).toHaveCount(1);
    }

    // Dismiss via an outside click (the popover has no backdrop) instead of Escape, covering the
    // other dismissal path, and confirm the toolbar underneath is still interactive.
    await page.mouse.click(5, 5);
    await expect(dialog).toHaveCount(0);
    await expect(
      page.locator('app-toolbar').getByRole('button', { name: 'Add Profile' }),
    ).toBeVisible();
  });

  test('on a phone both open as sheets from the More actions menu', async ({
    page,
    loginAsAdmin,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsAdmin();

    // The desktop buttons are hidden on phones; the menu is the entry point.
    await expect(
      page.locator('app-toolbar').getByRole('button', { name: 'Zodiac signs' }),
    ).toBeHidden();

    await page.locator('app-toolbar').getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Preferred Star' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Preferred Star' })).toBeVisible();
    await expect(dialog.getByRole('listitem')).toHaveCount(expectedStarGroups().length);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);

    await page.locator('app-toolbar').getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Zodiac Signs' }).click();
    await expect(dialog.getByRole('heading', { name: 'Zodiac Signs' })).toBeVisible();
    await expect(dialog.getByRole('listitem')).toHaveCount(Object.keys(ZODIAC_LIST).length);
  });
});
