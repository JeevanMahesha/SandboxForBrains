import type { Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import {
  expect,
  fillWizardProfile,
  openNewProfileWizard,
  openProfileDrawer,
  profileRows,
  test,
} from './support/fixtures';

// The WhatsApp action and the wizard's "step done" marker share one `--success` token instead of
// repeating raw palette classes. Colours are compared as the browser resolves them.

/** The token resolved to the colour the browser paints, or null when it is not defined. */
async function successToken(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    if (!getComputedStyle(document.documentElement).getPropertyValue('--success').trim()) {
      return null;
    }
    const probe = document.createElement('div');
    probe.style.color = 'var(--success)';
    document.body.appendChild(probe);
    const colour = getComputedStyle(probe).color;
    probe.remove();
    return colour;
  });
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`success token (${theme})`, () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('theme-preference', value), theme);
      await page.emulateMedia({ colorScheme: theme });
    });

    test('the list WhatsApp action uses the token colour', async ({ page, loginAsAdmin }) => {
      await seedProfiles([makeProfile(0, { name: 'Token Row' })]);
      await loginAsAdmin();
      await expect(profileRows(page)).toHaveCount(1);

      const token = await successToken(page);
      expect(token, '--success is defined').not.toBeNull();
      const link = profileRows(page)
        .first()
        .getByRole('link', { name: /WhatsApp/ });
      expect(await link.evaluate((el) => getComputedStyle(el).color)).toBe(token);
    });

    test('the drawer WhatsApp action uses the token colour', async ({ page, loginAsAdmin }) => {
      await seedProfiles([makeProfile(0, { name: 'Token Drawer' })]);
      await loginAsAdmin();
      await openProfileDrawer(page, 'View');
      const link = page.getByRole('dialog').getByRole('link', { name: 'WhatsApp' });
      await expect(link).toBeVisible();

      const token = await successToken(page);
      expect(token, '--success is defined').not.toBeNull();
      expect(await link.evaluate((el) => getComputedStyle(el).color)).toBe(token);
    });

    test('a finished wizard step marker uses the token colour', async ({ page, loginAsAdmin }) => {
      await loginAsAdmin();
      await openNewProfileWizard(page);
      await fillWizardProfile(page, {
        name: 'Token Wizard',
        mobile: '98765 43210',
        matrimonyId: 'M-Token',
        status: 'New',
        zodiac: 'Mesham (Aries)',
        age: '27',
        state: 'Tamil Nadu',
        city: 'Chennai',
      });

      // The fill ends on step 3, so step 1 is complete and not current: its marker is "done".
      const marker = page
        .getByRole('navigation', { name: 'Profile creation steps' })
        .getByRole('button')
        .first()
        .locator('span[aria-hidden="true"]');
      await expect(marker).toBeVisible();

      const token = await successToken(page);
      expect(token, '--success is defined').not.toBeNull();
      expect(await marker.evaluate((el) => getComputedStyle(el).color)).toBe(token);
    });
  });
}
