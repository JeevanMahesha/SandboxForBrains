import type { Locator, Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, test } from './support/fixtures';

// Small uppercase section labels share one look (`section-label` utility): the drawer's
// "Contact"/"Notes" headings, the phone Filters sheet labels and the Preferred star popover's
// "N stars" captions used to drift apart in size, weight and tracking.
const typography = (label: Locator) =>
  label.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      letterSpacing: s.letterSpacing,
      textTransform: s.textTransform,
      color: s.color,
    };
  });

/** Opens the view drawer and returns the typography of its "Contact" heading (the reference). */
async function drawerReference(page: Page) {
  await page.getByTestId('profile-card').first().getByRole('button', { name: 'View' }).click();
  const drawer = page.getByRole('dialog');
  await expect(drawer.getByRole('heading', { name: 'View Profile' })).toBeVisible();
  const reference = await typography(drawer.getByRole('heading', { name: 'Contact' }));
  expect(reference.textTransform).toBe('uppercase');
  expect(await typography(drawer.getByRole('heading', { name: /^Notes · / }))).toEqual(reference);
  await drawer.locator('hlm-sheet-footer').getByRole('button', { name: 'Close' }).click();
  await expect(drawer).toBeHidden();
  return reference;
}

test.describe('section labels', () => {
  test('the Preferred star popover captions match the drawer headings', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0)]);
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsAdmin();
    const reference = await drawerReference(page);

    await page.locator('app-toolbar').getByRole('button', { name: 'Preferred star' }).click();
    const caption = page
      .getByRole('dialog')
      .getByText(/^\s*\d+ stars?\s*$/)
      .first();
    await expect(caption).toBeVisible();
    expect(await typography(caption)).toEqual(reference);
  });

  test('the phone Filters sheet labels match the drawer headings', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0)]);
    await page.setViewportSize({ width: 390, height: 800 });
    await loginAsAdmin();
    const reference = await drawerReference(page);

    await page.getByRole('button', { name: /^Filters/ }).click();
    const sheet = page.getByRole('dialog', { name: 'Filters' });
    for (const text of ['Sort', 'Profile Status', 'Star Match Score']) {
      const label = sheet.getByText(text, { exact: true }).first();
      await expect(label).toBeVisible();
      expect(await typography(label), text).toEqual(reference);
    }
  });
});
