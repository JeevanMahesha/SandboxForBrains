import { expect, type Page, test as base } from '@playwright/test';
import { ADMIN_USER, clearFirestore } from './emulator';

interface Fixtures {
  /** Auto fixture: every browser test starts from an empty Firestore. */
  resetFirestore: void;
  /** Logs in through the real login form. Session persistence is per-tab, so this runs per test. */
  loginAsAdmin: () => Promise<void>;
}

export const test = base.extend<Fixtures>({
  resetFirestore: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await clearFirestore();
      await use();
    },
    { auto: true },
  ],
  loginAsAdmin: async ({ page }, use) => {
    await use(async () => {
      await page.goto('/login');
      await page.locator('#login-email').fill(ADMIN_USER.email);
      await page.locator('#login-password').fill(ADMIN_USER.password);
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL(/\/$/);
    });
  },
});

export { expect };

/** Picks an option from a Spartan `hlm-select`: open its combobox trigger, click the option. */
export async function pickOption(
  page: Page,
  hostSelector: string,
  optionText: string,
): Promise<void> {
  await page.locator(`${hostSelector} [role="combobox"]`).click();
  await page.getByRole('option', { name: optionText, exact: true }).click();
}

/** Profile cards (desktop grid and mobile list share the same test id; skeletons are excluded). */
export function profileRows(page: Page) {
  return page.getByTestId('profile-card');
}

/** The "N profile(s) count next to the pager." footer cell. */
export function profilesTotal(page: Page) {
  return page.getByTestId('profiles-total');
}

/** A status filter chip in the toolbar (single-select, `aria-pressed` reflects the active one). */
export function statusChip(page: Page, label: string) {
  return page.getByRole('button', { name: label, exact: true });
}

/** Opens the create wizard from the list toolbar (step 1 of 3). */
export async function openNewProfileWizard(page: Page): Promise<void> {
  await page.locator('app-toolbar').getByRole('button', { name: 'Add Profile' }).click();
  await expect(page).toHaveURL(/\/profiles\/new$/);
  await expect(page.getByRole('heading', { name: 'Add New Profile' })).toBeVisible();
}

/** Advances the wizard; only one step's panel exists at a time. */
export async function wizardContinue(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Continue' }).click();
}

export interface WizardProfile {
  name: string;
  mobile: string;
  matrimonyId: string;
  status: string;
  zodiac: string;
  /** Star option label; omitted leaves the star unset. */
  star?: string;
  age: string;
  state: string;
  city: string;
}

/**
 * Fills the three wizard steps with the given values and stops on step 3 (the Save button),
 * so each spec can still assert on the final submit itself.
 */
export async function fillWizardProfile(page: Page, profile: WizardProfile): Promise<void> {
  await page.locator('#name').fill(profile.name);
  await page.locator('#mobile').fill(profile.mobile);
  await page.locator('#matrimony').fill(profile.matrimonyId);
  await pickOption(page, 'hlm-select#profile_status', profile.status);
  await wizardContinue(page);

  await pickOption(page, 'hlm-select#zodiac_sign', profile.zodiac);
  if (profile.star) {
    await pickOption(page, 'hlm-select#star_sign', profile.star);
  }
  await page.locator('#age').fill(profile.age);
  await wizardContinue(page);

  await pickOption(page, 'hlm-select#state', profile.state);
  await pickOption(page, 'hlm-select#city', profile.city);
}
