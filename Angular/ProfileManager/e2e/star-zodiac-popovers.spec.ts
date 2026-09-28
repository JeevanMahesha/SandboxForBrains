import { STAR_SCORES, ZODIAC_LIST } from '../src/app/constant/common.const';
import { expect, test } from './support/fixtures';

// These are the toolbar's reference popovers (`app-zodiac-signs` / `app-star-match`), opened via
// the "More actions" dropdown next to "Add Profile". They are read-only lookups — not form
// controls — so there is nothing here to "select": the Zodiac Signs popover lists every sign
// with its compatible stars, and the Preferred Star popover lists every star ranked by score.
// Neither is wired to the profile drawer's own (unrelated) `hlm-select#zodiac_sign`/`#star`
// fields, which are already covered in profile-create.spec.ts/profile-view.spec.ts.

test.describe('star match / zodiac signs popovers', () => {
  test('Zodiac Signs popover lists every sign with its compatible stars, and Escape dismisses it', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();

    await page.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Zodiac Signs' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Zodiac Signs' })).toBeVisible();

    // Every sign in ZODIAC_LIST renders, each showing its own compatible stars (not a plain
    // select of sign names — the popover's whole point is surfacing the star compatibility).
    for (const [, sign] of Object.entries(ZODIAC_LIST)) {
      const row = dialog.getByText(sign.tanglish, { exact: true }).locator('xpath=../..');
      await expect(row).toBeVisible();
      await expect(row.getByText(sign.english, { exact: true })).toBeVisible();
      for (const star of sign.stars) {
        await expect(row.getByText(star, { exact: true })).toBeVisible();
      }
    }

    // Dismiss without "selecting" anything (there is nothing to select) and confirm the rest of
    // the toolbar is unaffected.
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Add Profile' })).toBeVisible();
  });

  test('Preferred Star popover ranks every star by score, highest first, and closes on outside click', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();

    await page.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Preferred Star' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Preferred Star' })).toBeVisible();

    // The component sorts its own data by score descending; derive the expected order from
    // STAR_SCORES the same way rather than hardcoding a ranking that would drift silently.
    const expectedOrder = Object.entries(STAR_SCORES)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([name]) => name);

    const rows = await dialog.locator('li p').allTextContents();
    const actualOrder = rows.map((text) => text.replace(/^\d+\.\s*/, ''));
    expect(actualOrder).toEqual(expectedOrder);

    // Scores render alongside the names, not just the ranking.
    const [topStar, topScore] = Object.entries(STAR_SCORES).sort(
      ([, scoreA], [, scoreB]) => scoreB - scoreA,
    )[0];
    await expect(dialog.locator('li').first()).toContainText(topStar);
    await expect(dialog.locator('li').first()).toContainText(String(topScore));

    // Dismiss via an outside click (the popover has no backdrop) instead of Escape, covering the
    // other dismissal path, and confirm the toolbar underneath is still interactive.
    await page.mouse.click(5, 5);
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Add Profile' })).toBeVisible();
  });
});
