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

/** Rows of the desktop profiles table (skeleton rows are excluded). */
export function profileRows(page: Page) {
  return page.getByTestId('profile-row');
}

/** The "In total there are N profiles." footer cell. */
export function profilesTotal(page: Page) {
  return page.getByTestId('profiles-total');
}
