import { PROFILE_STATUS, ZODIAC_LIST } from '../src/app/constant/common.const';
import {
  expect,
  fillWizardProfile,
  openNewProfileWizard,
  profileRows,
  profilesTotal,
  test,
} from './support/fixtures';

// The select lists its options as "<tanglish> (<english>)" (see zodiacToLabel in
// profile-form-fields.ts); derive the expected label from the same source data rather than
// hardcoding it, so a wording change to either name doesn't silently desync this test.
const ARIES_LABEL = `${ZODIAC_LIST.aries.tanglish} (${ZODIAC_LIST.aries.english})`;

test.describe('create profile', () => {
  test('saves a new profile through the wizard and lists it', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();

    await openNewProfileWizard(page);
    await fillWizardProfile(page, {
      name: 'Anjali Kumar',
      mobile: '98765 43210',
      matrimonyId: 'M2026',
      status: PROFILE_STATUS.NEW,
      zodiac: ARIES_LABEL,
      age: '27',
      state: 'Tamil Nadu',
      city: 'Chennai',
    });

    await page.getByRole('button', { name: 'Create profile' }).click();

    await expect(page.getByText('Profile added successfully')).toBeVisible();
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profileRows(page).first()).toContainText('Anjali Kumar');
    // The loosely typed number is persisted in the canonical +91 form.
    await expect(profileRows(page).first()).toContainText('+919876543210');
    await expect(profilesTotal(page)).toHaveText(/^1 profile$/);
  });

  test('does not carry an abandoned draft into the next Add Profile', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();

    await openNewProfileWizard(page);
    await page.locator('#name').fill('Abandoned Draft');
    // Leave through the "back to the list" link instead of saving.
    await page.getByRole('link', { name: 'Back to profiles' }).click();
    await expect(page).toHaveURL(/\/$/);

    await openNewProfileWizard(page);
    await expect(page.locator('#name')).toHaveValue('');
  });
});
