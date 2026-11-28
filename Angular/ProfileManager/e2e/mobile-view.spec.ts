import type { Locator, Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import {
  expect,
  expectToolbarControlsUnclipped,
  openNewProfileWizard,
  sheetStatusButton,
  statusFilter,
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

    // On mobile the search box sits on the toolbar itself, no need to open the sheet first.
    const search = page.getByPlaceholder('Search by full ID or phone');
    await search.click();
    await search.pressSequentially('+91 99999 99999');
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

for (const width of [768, 820, 1024, 1280]) {
  test.describe(`toolbar at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('no control is clipped and the status select is named', async ({ page, loginAsAdmin }) => {
      await seedProfiles([makeProfile(0)]);
      await loginAsAdmin();
      await expect(page.getByTestId('profile-card')).toHaveCount(1);

      await expect(statusFilter(page)).toHaveText('All statuses');
      await expectToolbarControlsUnclipped(page);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
        'no horizontal page scroll',
      ).toBe(true);
    });
  });
}

test.describe('phone Filters sheet status buttons', () => {
  test('keep wrapped aria-pressed buttons and filter the list', async ({ page, loginAsAdmin }) => {
    await seedProfiles([
      makeProfile(0, { name: 'Acc One', profileStatusId: 'ACCEPTED' }),
      makeProfile(1, { name: 'New One', profileStatusId: 'NEW' }),
    ]);
    await loginAsAdmin();
    await expect(page.getByTestId('profile-card')).toHaveCount(2);

    await page.getByRole('button', { name: 'Filters' }).click();
    await sheetStatusButton(page, 'Accepted').click();
    await expect(sheetStatusButton(page, 'Accepted')).toHaveAttribute('aria-pressed', 'true');
    await expect(sheetStatusButton(page, 'All')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByTestId('profile-card')).toHaveCount(1);
  });
});

test.describe('mobile tap targets', () => {
  /**
   * The tappable size of a control: its own box, or the box of an invisible `::after` hit area
   * when it enlarges one (the matrimony-ID and drawer copy buttons keep their small look).
   */
  const tapSize = (control: Locator) =>
    control.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const after = getComputedStyle(element, '::after');
      const afterWidth = after.position === 'absolute' ? parseFloat(after.width) || 0 : 0;
      const afterHeight = after.position === 'absolute' ? parseFloat(after.height) || 0 : 0;
      return {
        width: Math.max(box.width, afterWidth),
        height: Math.max(box.height, afterHeight),
      };
    });

  test('card and drawer copy/call/WhatsApp controls are at least 44x44 to tap', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Tap Target Profile' })]);
    await loginAsAdmin();
    const card = page.getByTestId('profile-card').first();
    await expect(card).toBeVisible();

    const cardControls = [
      card.getByRole('button', { name: 'Copy matrimony ID' }),
      card.getByRole('button', { name: 'Copy mobile number' }),
      card.getByRole('link', { name: 'Call' }),
      card.getByRole('link', { name: 'WhatsApp' }),
    ];
    for (const control of cardControls) {
      const size = await tapSize(control);
      expect(size.width, await control.getAttribute('aria-label')).toBeGreaterThanOrEqual(44);
      expect(size.height, await control.getAttribute('aria-label')).toBeGreaterThanOrEqual(44);
    }

    await card.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'View Profile' })).toBeVisible();
    for (const name of ['Copy mobile number', 'Copy matrimony ID']) {
      const size = await tapSize(dialog.getByRole('button', { name }));
      expect(size.width, name).toBeGreaterThanOrEqual(44);
      expect(size.height, name).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('phone card keyboard and semantics', () => {
  const viewHeading = (page: Page) =>
    page.getByRole('dialog').getByRole('heading', { name: 'View Profile' });

  test('the card is not a button wrapping other buttons', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0, { name: 'Semantics Profile' })]);
    await loginAsAdmin();
    const card = page.getByTestId('profile-card').first();
    await expect(card).toBeVisible();

    // A role=button container with buttons and links inside is invalid nested-interactive markup.
    await expect(card).not.toHaveAttribute('role', 'button');
    await expect(card).not.toHaveAttribute('tabindex', /.*/);
  });

  test('Enter on the controls inside the card does not open the profile', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Keyboard Profile' })]);
    await loginAsAdmin();
    const card = page.getByTestId('profile-card').first();
    await expect(card).toBeVisible();

    // Dispatched keydowns (not real key presses) so the WhatsApp link does not open a new tab.
    const controls: [string, Locator][] = [
      ['Copy matrimony ID', card.getByRole('button', { name: 'Copy matrimony ID' })],
      ['Copy mobile number', card.getByRole('button', { name: 'Copy mobile number' })],
      ['Call', card.getByRole('link', { name: 'Call' })],
      ['WhatsApp', card.getByRole('link', { name: 'WhatsApp' })],
      ['More actions', card.getByRole('button', { name: 'More actions' })],
    ];
    for (const [name, control] of controls) {
      await control.dispatchEvent('keydown', { key: 'Enter' });
      await expect(page.getByRole('dialog'), `Enter on ${name}`).toHaveCount(0);
    }
  });

  test('the View control opens the profile with Enter and with Space', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'View Key Profile' })]);
    await loginAsAdmin();
    const card = page.getByTestId('profile-card').first();
    const view = card.getByRole('button', { name: 'View View Key Profile', exact: true });

    for (const key of ['Enter', 'Space']) {
      await view.focus();
      await page.keyboard.press(key);
      await expect(viewHeading(page), `${key} opens View`).toBeVisible();
      await page.getByRole('dialog').getByRole('button', { name: 'Close' }).first().click();
      await expect(viewHeading(page)).toBeHidden();
    }
  });

  test('tapping the card body, away from its controls, still opens the profile', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Body Tap Profile' })]);
    await loginAsAdmin();
    const card = page.getByTestId('profile-card').first();

    // The padding at the card's top-left corner holds no control.
    await card.click({ position: { x: 8, y: 8 } });
    await expect(viewHeading(page)).toBeVisible();
  });
});

test.describe('phone filters toolbar', () => {
  const search = (page: Page) => page.getByPlaceholder('Search by full ID or phone');
  const filtersButton = (page: Page) =>
    page.locator('app-toolbar').getByRole('button', { name: /^Filters/ });
  const sheet = (page: Page) => page.getByRole('dialog', { name: 'Filters' });
  const cards = (page: Page) => page.getByTestId('profile-card');

  test.beforeEach(async () => {
    await seedProfiles([
      makeProfile(0, { name: 'Acc Six', profileStatusId: 'ACCEPTED', starMatchScore: 6 }),
      makeProfile(1, { name: 'Acc Eight', profileStatusId: 'ACCEPTED', starMatchScore: 8 }),
      makeProfile(2, { name: 'New Six', profileStatusId: 'NEW', starMatchScore: 6 }),
    ]);
  });

  async function pickScore(page: Page, score: string) {
    await sheet(page).getByRole('combobox', { name: 'Star match score' }).click();
    await page.getByRole('option', { name: score, exact: true }).click();
  }

  test('search is on the toolbar without opening the sheet, and works', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await expect(cards(page)).toHaveCount(3);

    await expect(search(page)).toBeVisible();
    await expect(sheet(page)).toHaveCount(0);
    await search(page).fill('M1001');
    await search(page).press('Enter');
    await expect(cards(page)).toHaveCount(1);
    await expect(cards(page).first()).toContainText('Acc Eight');
  });

  test('the Filters button counts active filters and hides the count at zero', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await expect(cards(page)).toHaveCount(3);
    await expect(filtersButton(page)).toHaveAccessibleName('Filters');

    await filtersButton(page).click();
    await sheetStatusButton(page, 'Accepted').click();
    await pickScore(page, '6');
    await expect(cards(page)).toHaveCount(1);
    await sheet(page)
      .getByRole('button', { name: /^Show \d+ profile/ })
      .click();
    await expect(sheet(page)).toHaveCount(0);
    await expect(filtersButton(page)).toHaveAccessibleName('Filters, 2 active');

    await page.getByRole('button', { name: 'Remove filter Accepted' }).click();
    await page.getByRole('button', { name: 'Remove filter Score 6' }).click();
    await expect(filtersButton(page)).toHaveAccessibleName('Filters');
  });

  test('active filters show as chips; removing one clears only that filter', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await expect(cards(page)).toHaveCount(3);
    await expect(page.getByRole('button', { name: /^Remove filter/ })).toHaveCount(0);

    await filtersButton(page).click();
    await sheetStatusButton(page, 'Accepted').click();
    await pickScore(page, '6');
    await sheet(page)
      .getByRole('button', { name: /^Show \d+ profile/ })
      .click();

    await expect(page.getByRole('button', { name: 'Remove filter Accepted' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove filter Score 6' })).toBeVisible();
    await expect(cards(page)).toHaveCount(1);

    // Removing the status chip keeps the score filter: Acc Six and New Six both score 6.
    await page.getByRole('button', { name: 'Remove filter Accepted' }).click();
    await expect(page.getByRole('button', { name: 'Remove filter Accepted' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Remove filter Score 6' })).toBeVisible();
    await expect(cards(page)).toHaveCount(2);
    await expect(filtersButton(page)).toHaveAccessibleName('Filters, 1 active');
  });

  test('"Show N profiles" follows the live total and closes the sheet', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await expect(cards(page)).toHaveCount(3);

    await filtersButton(page).click();
    await expect(sheet(page).getByRole('button', { name: 'Show 3 profiles' })).toBeVisible();
    await sheetStatusButton(page, 'Accepted').click();
    await expect(sheet(page).getByRole('button', { name: 'Show 2 profiles' })).toBeVisible();
    await pickScore(page, '6');
    const show = sheet(page).getByRole('button', { name: 'Show 1 profile' });
    await expect(show).toBeVisible();

    await show.click();
    await expect(sheet(page)).toHaveCount(0);
    await expect(cards(page)).toHaveCount(1);
  });

  test('Clear resets the sheet filters but keeps the typed search', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await expect(cards(page)).toHaveCount(3);
    await search(page).fill('M1000');
    await search(page).press('Enter');
    await expect(cards(page)).toHaveCount(1);

    await filtersButton(page).click();
    await sheetStatusButton(page, 'Accepted').click();
    await pickScore(page, '6');
    await sheet(page).getByRole('button', { name: 'Clear' }).click();

    await expect(sheetStatusButton(page, 'All')).toHaveAttribute('aria-pressed', 'true');
    await expect(sheet(page).getByRole('combobox', { name: 'Star match score' })).toHaveText(
      'Star match score',
    );
    await sheet(page)
      .getByRole('button', { name: /^Show \d+ profile/ })
      .click();
    await expect(page.getByRole('button', { name: /^Remove filter/ })).toHaveCount(0);
    await expect(search(page)).toHaveValue('M1000');
    await expect(cards(page)).toHaveCount(1);
  });
});
