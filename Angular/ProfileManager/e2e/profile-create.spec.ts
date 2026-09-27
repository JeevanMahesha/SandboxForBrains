import { PROFILE_STATUS, ZODIAC_LIST } from '../src/app/constant/common.const';
import { expect, pickOption, profileRows, profilesTotal, test } from './support/fixtures';

// The select lists its options as "<tanglish> (<english>)" (see ZodiacSign in
// profile-form-fields.ts); derive the expected label from the same source data rather than
// hardcoding it, so a wording change to either name doesn't silently desync this test.
const ARIES_LABEL = `${ZODIAC_LIST.aries.tanglish} (${ZODIAC_LIST.aries.english})`;

test.describe('create profile', () => {
  test('saves a new profile through the drawer and lists it', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();

    await page.getByRole('button', { name: 'Add Profile' }).click();
    await expect(page.getByRole('heading', { name: 'Add New Profile' })).toBeVisible();

    await page.locator('#name').fill('Anjali Kumar');
    await page.locator('#mobile').fill('98765 43210');
    await page.locator('#matrimony').fill('M2026');
    await pickOption(page, 'hlm-select#profile_status', PROFILE_STATUS.NEW);
    await pickOption(page, 'hlm-select#zodiac_sign', ARIES_LABEL);
    await page.locator('#age').fill('27');
    await pickOption(page, 'hlm-select#state', 'Tamil Nadu');
    await pickOption(page, 'hlm-select#city', 'Chennai');

    await page.getByRole('button', { name: 'Save Changes' }).click();

    await expect(page.getByText('Profile added successfully')).toBeVisible();
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profileRows(page).first()).toContainText('Anjali Kumar');
    // The loosely typed number is persisted in the canonical +91 form.
    await expect(profileRows(page).first()).toContainText('+919876543210');
    await expect(profilesTotal(page)).toHaveText(/In total there are 1 profiles\./);
  });

  test('does not carry an abandoned draft into the next Add Profile', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();

    await page.getByRole('button', { name: 'Add Profile' }).click();
    await page.locator('#name').fill('Abandoned Draft');
    // The sheet's built-in close (X) button — there is no separate "Close" footer button in
    // create mode, only "Save Changes".
    await page.getByRole('button', { name: 'Close' }).click();

    await page.getByRole('button', { name: 'Add Profile' }).click();
    await expect(page.locator('#name')).toHaveValue('');
  });
});
