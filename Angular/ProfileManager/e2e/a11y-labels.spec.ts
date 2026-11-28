import { makeProfile, seedProfiles } from './support/emulator';
import {
  expect,
  openNewProfileWizard,
  pickOption,
  profileRows,
  test,
  wizardContinue,
} from './support/fixtures';

// Every select must be reachable by role + accessible name (WCAG 1.3.1 / 4.1.2 / 3.3.2). The
// wizard marks required fields, so its names end in " *"; a prefix match covers both.
const named = (label: string) => new RegExp(`^${label}`);

test.describe('select accessible names', () => {
  test('every select in the create wizard is named, step by step', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);

    await expect(page.getByRole('combobox', { name: named('Profile Status') })).toBeVisible();

    await page.locator('#name').fill('Label Test');
    await page.locator('#mobile').fill('98765 43210');
    await page.locator('#matrimony').fill('M-Label-Test');
    await wizardContinue(page);

    await expect(page.getByRole('combobox', { name: named('Zodiac Sign') })).toBeVisible();
    await expect(page.getByRole('combobox', { name: named('Star Sign') })).toBeVisible();
    await pickOption(page, 'hlm-select#zodiac_sign', 'Mesham (Aries)');
    await page.locator('#age').fill('27');
    await wizardContinue(page);

    await expect(page.getByRole('combobox', { name: named('State') })).toBeVisible();
    await expect(page.getByRole('combobox', { name: named('City') })).toBeVisible();
  });

  test('every select in the edit drawer is named', async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0)]);
    await loginAsAdmin();
    await profileRows(page).first().getByRole('button', { name: 'Edit' }).click();

    const drawer = page.getByRole('dialog', { name: 'Edit Profile' });
    for (const label of ['Profile Status', 'Zodiac Sign', 'Star Sign', 'State', 'City']) {
      await expect(drawer.getByRole('combobox', { name: named(label) }), label).toBeVisible();
    }
  });

  test('the Sort select is named in the desktop toolbar', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    await expect(page.getByRole('combobox', { name: named('Sort order') })).toBeVisible();
  });

  test('the Sort select is named in the phone Filters sheet', async ({ page, loginAsAdmin }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsAdmin();
    await page.getByRole('button', { name: /^Filters/ }).click();

    const sheet = page.getByRole('dialog', { name: 'Filters' });
    await expect(sheet.getByRole('combobox', { name: 'Sort' })).toBeVisible();
  });
});
