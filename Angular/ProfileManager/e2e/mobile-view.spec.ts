import { makeProfile, seedProfiles } from './support/emulator';
import {
  expect,
  expectToolbarControlsUnclipped,
  openNewProfileWizard,
  statusChip,
  test,
} from './support/fixtures';

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

  test('Add Profile is a 56px floating button that opens the wizard and clears the list', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles(Array.from({ length: 3 }, (_, i) => makeProfile(i)));
    await loginAsAdmin();
    await expect(page.getByTestId('profile-card')).toHaveCount(3);

    const fab = page.locator('app-toolbar').getByRole('button', { name: 'Add Profile' });
    await expect(fab).toBeVisible();
    const box = (await fab.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(56);
    expect(box.height).toBeGreaterThanOrEqual(56);
    const viewport = page.viewportSize()!;
    expect(box.x + box.width).toBeGreaterThan(viewport.width - 32);
    expect(box.y + box.height).toBeGreaterThan(viewport.height - 32);

    // Scrolled to the bottom, the pager must be fully visible above the floating button.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const pager = page.locator('nav[aria-label="pagination"]');
    await expect(pager).toBeVisible();
    const pagerBox = (await pager.boundingBox())!;
    expect(pagerBox.y + pagerBox.height).toBeLessThanOrEqual(box.y);

    await openNewProfileWizard(page);
  });

  test('other toolbar tap targets are at least 44px tall', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();
    for (const name of ['Filters', /^Theme/, 'Account menu']) {
      const box = (await page.locator('app-toolbar').getByRole('button', { name }).boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });
});

for (const width of [768, 820, 1024]) {
  test.describe(`toolbar at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('status chips are one scrolling row and no control is clipped', async ({
      page,
      loginAsAdmin,
    }) => {
      await seedProfiles([makeProfile(0)]);
      await loginAsAdmin();
      await expect(page.getByTestId('profile-card')).toHaveCount(1);

      const group = page.getByRole('group', { name: 'Profile status' });
      const chips = group.getByRole('button');
      const tops = await chips.evaluateAll((els) =>
        els.map((el) => Math.round(el.getBoundingClientRect().top)),
      );
      expect(new Set(tops).size, 'all chips on one line').toBe(1);
      if (width < 1024) {
        // Below lg the row scrolls instead of wrapping; lg and up keeps the desktop wrap.
        expect(await group.evaluate((el) => getComputedStyle(el).flexWrap)).toBe('nowrap');
      }
      await expectToolbarControlsUnclipped(page);

      if (width < 1024) {
        // Sort, star and Clear share one line with the chip row.
        const clear = page.locator('app-toolbar').getByRole('button', { name: 'Clear' });
        const clearBox = (await clear.boundingBox())!;
        const groupBox = (await group.boundingBox())!;
        expect(Math.abs(clearBox.y - groupBox.y)).toBeLessThan(groupBox.height);
      }
    });
  });
}

test.describe('scrolling chip row at 768px', () => {
  test.use({ viewport: { width: 768, height: 900 } });

  test('keeps the selected chip in view', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();
    const group = page.getByRole('group', { name: 'Profile status' });
    const last = group.getByRole('button').last();
    await last.scrollIntoViewIfNeeded();
    await last.click();
    await expect(last).toHaveAttribute('aria-pressed', 'true');
    const inView = await group.evaluate((el) => {
      const chip = el.querySelector('[aria-pressed="true"]')!.getBoundingClientRect();
      const box = el.getBoundingClientRect();
      return chip.left >= box.left - 1 && chip.right <= box.right + 1;
    });
    expect(inView).toBe(true);
    await expect(statusChip(page, 'All')).toHaveAttribute('aria-pressed', 'false');
  });
});
