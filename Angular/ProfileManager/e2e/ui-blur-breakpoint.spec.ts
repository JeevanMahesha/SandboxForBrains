import type { Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

/** Only the cards of the view that is on screen: the other layout stays in the DOM, hidden. */
const visibleCards = (page: Page) => profileRows(page).locator('visible=true');

const glassBlur = (page: Page) =>
  page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--glass-blur').trim(),
  );

test.describe('glass blur follows the phone/desktop layout split', () => {
  test.beforeEach(async ({ loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();
  });

  for (const [width, blur] of [
    [390, '10px'],
    [700, '10px'],
    [767, '10px'],
    [768, '20px'],
    [1024, '20px'],
  ] as const) {
    test(`${width}px wide uses a ${blur} blur`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await expect(visibleCards(page)).toHaveCount(1);
      expect(await glassBlur(page)).toBe(blur);
    });
  }

  test('the blur flips at the same width as the card layout', async ({ page }) => {
    await page.setViewportSize({ width: 767, height: 800 });
    await expect(visibleCards(page)).toHaveCount(1);
    expect(await glassBlur(page)).toBe('10px');
    await page.setViewportSize({ width: 768, height: 800 });
    await expect(visibleCards(page)).toHaveCount(1);
    expect(await glassBlur(page)).toBe('20px');
  });
});
