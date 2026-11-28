import type { Locator, Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, openNewProfileWizard, profileRows, statusFilter, test } from './support/fixtures';

// Windows High Contrast ("forced colors") replaces every background-color with the system
// Canvas colour, so anything that shows state only through a background fill disappears.
// Playwright can emulate it, which makes the computed styles below what a user would get.

/** What the browser actually paints for an element's own fill and border. */
function paint(locator: Locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      background: style.backgroundColor,
      image: style.backgroundImage,
      border: `${style.borderTopWidth} ${style.borderTopStyle} ${style.borderTopColor}`,
    };
  });
}

/** The resolved system Canvas colour, i.e. what a plain forced-colors background looks like. */
function canvasColour(page: Page) {
  return page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.backgroundColor = 'Canvas';
    document.body.appendChild(probe);
    const colour = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return colour;
  });
}

test.describe('forced colors (Windows High Contrast)', () => {
  test.describe('on a phone', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('the wizard progress bar still tells finished steps from pending ones', async ({
      page,
      loginAsAdmin,
    }) => {
      await page.emulateMedia({ forcedColors: 'active' });
      await loginAsAdmin();
      await openNewProfileWizard(page);

      const segments = page.getByRole('progressbar', { name: 'Progress' }).locator('span');
      await expect(segments).toHaveCount(3);
      const done = await paint(segments.first());
      const pending = await paint(segments.last());

      expect(pending, 'a pending segment must not look like a finished one').not.toEqual(done);
    });
  });

  test('status colour marks stay visible: the card edge and the dots next to status names', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0)]);
    await page.emulateMedia({ forcedColors: 'active' });
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(1);
    const canvas = await canvasColour(page);

    const visible = async (mark: Locator, what: string) => {
      await expect(mark, what).toBeVisible();
      const { background, border } = await paint(mark);
      expect(
        background !== canvas || !border.startsWith('0px'),
        `${what} paints ${background} (${border}), the same as the ${canvas} page`,
      ).toBe(true);
    };

    await visible(
      profileRows(page).first().locator('span[aria-hidden="true"][class*="h-[3px]"]'),
      'card status edge',
    );

    await statusFilter(page).click();
    await visible(
      page
        .getByRole('option', { name: 'Accepted', exact: true })
        .locator('span[class*="rounded-full"]')
        .first(),
      'status filter dot',
    );
  });

  test('the exact time of day is available as text, not only as a hover title', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();
    await profileRows(page).first().getByRole('button', { name: 'View' }).click();
    const drawer = page.getByRole('dialog', { name: 'View Profile' });

    const audit = drawer.locator('p', { hasText: 'Created' });
    await expect(audit).toBeVisible();
    for (const stamp of await audit.locator('span[title]').all()) {
      const exact = await stamp.getAttribute('title');
      expect(exact).toBeTruthy();
      expect(await audit.textContent(), `"${exact}" is only in a title attribute`).toContain(exact);
    }
  });
});
