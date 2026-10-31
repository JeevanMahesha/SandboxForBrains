import type { Page } from '@playwright/test';
import { PROFILE_STATUS, ZODIAC_LIST } from '../src/app/constant/common.const';
import { toCanonicalMobileNumber } from '../src/app/utils/mobile-number.util';
import {
  expect,
  fillWizardProfile,
  openNewProfileWizard,
  profileRows,
  test,
  wizardContinue,
} from './support/fixtures';

// The select lists options as "<tanglish> (<english>)" (see zodiacToLabel in
// profile-form-fields.ts) — same derivation as profile-create.spec.ts.
const ARIES_LABEL = `${ZODIAC_LIST.aries.tanglish} (${ZODIAC_LIST.aries.english})`;

/** Fills every required field with a fixed valid value except mobile number, which is the one
 *  under test here. Ends on the last wizard step. */
async function fillMinimalProfile(page: Page, name: string, mobileNumber: string): Promise<void> {
  await openNewProfileWizard(page);
  await fillWizardProfile(page, {
    name,
    mobile: mobileNumber,
    matrimonyId: `M-${name}`,
    status: PROFILE_STATUS.NEW,
    zodiac: ARIES_LABEL,
    age: '27',
    state: 'Tamil Nadu',
    city: 'Chennai',
  });
}

test.describe('mobile number formats', () => {
  // mobile-number.util.ts documents these as accepted; each must canonicalize to the same
  // "+91XXXXXXXXXX" form regardless of how it was typed. The expected value is derived from the
  // app's own toCanonicalMobileNumber rather than hand-computed, so this can't drift from it.
  const ACCEPTED_FORMATS = [
    { label: 'leading 0 (trunk prefix)', input: '098765 43211' },
    { label: '91 prefix, no plus', input: '91 98765 43212' },
    { label: '+91 prefix with a dash', input: '+91 98765-43213' },
  ];

  for (const { label, input } of ACCEPTED_FORMATS) {
    test(`accepts ${label} and saves it in canonical form`, async ({ page, loginAsAdmin }) => {
      const expectedCanonical = toCanonicalMobileNumber(input);
      // Guards the test itself: if this is null, the fixture data is wrong, not the app.
      expect(expectedCanonical).not.toBeNull();

      await loginAsAdmin();
      await fillMinimalProfile(page, `Format Test ${label}`, input);
      await page.getByRole('button', { name: 'Save Changes' }).click();

      await expect(page.getByText('Profile added successfully')).toBeVisible();
      await expect(profileRows(page).first()).toContainText(expectedCanonical!);
    });
  }

  test('rejects an invalid mobile number with a validation message', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);
    // Too short and doesn't start with 6-9 — fails on both counts.
    await page.locator('#name').fill('Invalid Number Test');
    await page.locator('#mobile').fill('12345');
    await page.keyboard.press('Tab'); // blur the field so its error is allowed to show

    await expect(
      page.getByText('Invalid mobile number (e.g., 98765 43210 or +91 98765 43210)'),
    ).toBeVisible();
    // The wizard refuses to leave the step while the number is invalid, so the profile can
    // never reach the final Save step (which is disabled while the form is invalid).
    await wizardContinue(page);
    await expect(page.locator('#mobile')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save Changes' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible();
    await page.getByRole('link', { name: 'Back to profiles' }).click();
    await expect(profileRows(page)).toHaveCount(0);
  });
});
