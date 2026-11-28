import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import {
  expect,
  openNewProfileWizard,
  pickOption,
  profileRows,
  test,
  wizardContinue,
} from './support/fixtures';

// Automated WCAG 2.x A/AA scans (axe-core) of every main surface, in light and dark, on a desktop
// and a phone viewport. Only serious and critical violations fail the test; the "minor" and
// "moderate" ones axe reports are noise for a suite that already has targeted a11y specs.
//
// axe cannot compute text contrast over translucent glass or the aurora backdrop (it reports
// those nodes as "incomplete", never as violations), so contrast stays covered by
// a11y-contrast.spec.ts, ui-status-badges.spec.ts and ui-zodiac-contrast.spec.ts.

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  phone: { width: 390, height: 844 },
} as const;

/**
 * Real violations axe found when this spec was written. They are fenced off by tagging exactly
 * those elements (and nothing else), so anything NEW still fails the test. Fix the app, then
 * delete the matching entry here.
 *
 * - button-name (critical): the page-size select in the pagination (its trigger just shows "12")
 *   has no accessible name, unlike the status, sort and star-match selects that A11Y-1 named.
 * - label-content-name-mismatch (serious, WCAG 2.5.3): the copy-ID button shows the ID ("M1000")
 *   but is named "Copy matrimony ID of <name>", which does not contain the visible text, so
 *   voice-control users saying "click M1000" cannot reach it.
 */
const KNOWN_ISSUES = [
  {
    marker: 'page-size-select',
    locator: (page: Page) => page.locator('hlm-select-trigger button').filter({ hasText: /^\d+$/ }),
  },
  {
    marker: 'copy-id-button',
    locator: (page: Page) => page.getByRole('button', { name: /^Copy matrimony ID/ }),
  },
];

/** Violations axe reports, flattened to something readable in a failing test's diff. */
async function seriousViolations(page: Page): Promise<string[]> {
  for (const { marker, locator } of KNOWN_ISSUES) {
    await locator(page).evaluateAll((elements, name) => {
      for (const element of elements) {
        element.setAttribute('data-axe-known', name);
      }
    }, marker);
  }
  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .exclude('[data-axe-known]')
    .analyze();
  return violations
    .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    .map(
      (violation) =>
        `${violation.id} (${violation.impact}): ${violation.help} -> ` +
        violation.nodes
          .map((node) => `${node.target.join(' ')} [${node.html.slice(0, 140)}]`)
          .join(' | '),
    );
}

for (const theme of ['light', 'dark'] as const) {
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    test.describe(`axe scan (${theme}, ${viewportName})`, () => {
      test.beforeEach(async ({ page, loginAsAdmin }) => {
        // The theme preference defaults to "system", so the emulated colour scheme picks it.
        await page.emulateMedia({ colorScheme: theme });
        await page.setViewportSize(viewport);
        await seedProfiles([
          makeProfile(0, { name: 'Axe Subject', profileStatusId: 'MEETING_SCHEDULED', star: null }),
          makeProfile(1, { name: 'Axe Rejected', profileStatusId: 'REJECTED' }),
        ]);
        await loginAsAdmin();
        await expect(profileRows(page)).toHaveCount(2);
        await expect(page.locator('html')).toHaveClass(theme === 'dark' ? /dark/ : /^(?!.*dark)/);
        // Fades and slide-ins would be scanned half-way; the scan wants the settled state.
        await page.addStyleTag({
          content:
            '*, *::before, *::after { transition: none !important; animation: none !important; }',
        });
      });

      test('the profiles list', async ({ page }) => {
        expect(await seriousViolations(page)).toEqual([]);
      });

      test('the view drawer', async ({ page }) => {
        await profileRows(page).first().getByRole('button', { name: /^View/ }).click();
        const dialog = page.getByRole('dialog');
        await expect(dialog.getByRole('heading', { name: 'View Profile' })).toBeVisible();
        expect(await seriousViolations(page)).toEqual([]);
      });

      test('the edit drawer (details and notes)', async ({ page }) => {
        const card = profileRows(page).first();
        if (viewportName === 'phone') {
          // On a phone Edit lives in the card's kebab menu.
          await card.getByRole('button', { name: 'More actions' }).click();
          await page.getByRole('menuitem', { name: 'Edit' }).click();
        } else {
          await card.getByRole('button', { name: /^Edit/ }).click();
        }
        const dialog = page.getByRole('dialog');
        await expect(dialog.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
        expect(await seriousViolations(page), 'details tab').toEqual([]);

        await dialog.getByRole('tab', { name: /^Notes/ }).click();
        await expect(dialog.getByRole('tab', { name: /^Notes/ })).toHaveAttribute(
          'aria-selected',
          'true',
        );
        expect(await seriousViolations(page), 'notes tab').toEqual([]);
      });

      test('the create wizard (all three steps)', async ({ page }) => {
        await openNewProfileWizard(page);
        expect(await seriousViolations(page), 'step 1').toEqual([]);

        await page.locator('#name').fill('Axe New');
        await page.locator('#mobile').fill('98765 43210');
        await page.locator('#matrimony').fill('M-Axe');
        await wizardContinue(page);
        await expect(page.locator('#age')).toBeVisible();
        expect(await seriousViolations(page), 'step 2').toEqual([]);

        await pickOption(page, 'hlm-select#zodiac_sign', 'Mesham (Aries)');
        await page.locator('#age').fill('27');
        await wizardContinue(page);
        await expect(page.locator('hlm-select#state')).toBeVisible();
        expect(await seriousViolations(page), 'step 3').toEqual([]);
      });
    });
  }
}
