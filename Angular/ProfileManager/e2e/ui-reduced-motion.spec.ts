import type { Page, Route } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

/** The animation a loading indicator ends up with, read from the browser's computed style. */
async function animationOf(page: Page, selector: string) {
  return page
    .locator(selector)
    .first()
    .evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        name: style.animationName,
        duration:
          parseFloat(style.animationDuration) * (style.animationDuration.endsWith('ms') ? 1 : 1000),
        iterations: style.animationIterationCount,
      };
    });
}

const slowQueries = async (route: Route) => {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  await route.continue();
};

test.describe('loading indicators and motion preferences', () => {
  test('the search spinner pulses instead of freezing when reduced motion is on', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { matrimonyId: 'MOTION-001' })]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(1);

    await page.route(/runQuery/, slowQueries);
    const spinner = page.getByRole('status', { name: 'Searching' });
    await page.getByPlaceholder('Search by full ID or phone').fill('MOTION-001');
    await page.getByPlaceholder('Search by full ID or phone').press('Enter');
    await expect(spinner).toBeVisible();

    // Not a rotation (large-scale motion), but still visibly alive: a slow, endless pulse.
    const animation = await spinner.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        name: style.animationName,
        durationMs:
          parseFloat(style.animationDuration) * (style.animationDuration.endsWith('ms') ? 1 : 1000),
        iterations: style.animationIterationCount,
      };
    });
    expect(animation.name).not.toBe('none');
    expect(animation.name).not.toBe('spin');
    expect(animation.iterations).toBe('infinite');
    expect(animation.durationMs).toBeGreaterThanOrEqual(1000);
  });

  test('any plain animate-spin indicator (status menu) also pulses under reduced motion', async ({
    page,
    loginAsAdmin,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await loginAsAdmin();
    await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.id = 'spin-probe';
      probe.className = 'animate-spin';
      document.body.appendChild(probe);
    });

    const animation = await animationOf(page, '#spin-probe');
    expect(animation.name).not.toBe('none');
    expect(animation.name).not.toBe('spin');
    expect(animation.iterations).toBe('infinite');
    expect(animation.duration).toBeGreaterThanOrEqual(1000);
  });

  test('without the preference the spinner still rotates', async ({ page, loginAsAdmin }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await loginAsAdmin();
    await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.id = 'spin-probe';
      probe.className = 'animate-spin';
      document.body.appendChild(probe);
    });

    const animation = await animationOf(page, '#spin-probe');
    expect(animation.name).toBe('spin');
    expect(animation.iterations).toBe('infinite');
  });
});
