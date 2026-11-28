import { PROFILE_STATUS, ZODIAC_LIST } from '../src/app/constant/common.const';
import {
  expect,
  openNewProfileWizard,
  pickOption,
  profileRows,
  test,
  wizardContinue,
} from './support/fixtures';

// The select lists options as "<tanglish> (<english>)" (see zodiacToLabel in
// profile-form-fields.ts) — same derivation as profile-create.spec.ts.
const ARIES_LABEL = `${ZODIAC_LIST.aries.tanglish} (${ZODIAC_LIST.aries.english})`;

test.describe('profile form validation', () => {
  test('shows inline errors for empty required fields and gates every step until fixed', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);

    const saveButton = page.getByRole('button', { name: 'Create profile' });
    const heading = (name: string) => page.getByRole('heading', { name });

    // The form is invalid from the moment it opens (required fields are blank), but nothing has
    // been touched yet, so no error text is shown. Save only exists on the last step.
    await expect(saveButton).toHaveCount(0);
    await expect(page.getByRole('alert')).toHaveCount(0);

    // Signal-forms errors only render once a field is touched (see the `field().touched() &&
    // field().invalid()` guard in profile-form-fields.html), so blur each empty required field
    // (by moving focus to the next one) rather than asserting on value alone.
    //
    // Each error is looked up by a stable id (`fieldId` passed into the shared `#fieldError`
    // template in profile-form-fields.html), not by role+accessible-name: `hlm-field-error`'s
    // auto-generated id is otherwise a shared static counter, and matching by role name proved
    // unreliable here — `getByRole('alert', { name })` intermittently failed to find an element
    // that both `getByRole('alert')` (no name filter) and a raw DOM query found immediately,
    // even though Playwright's own `ariaSnapshot()` reported the correct computed name.
    const nameError = page.locator('#name-error');
    const matrimonyError = page.locator('#matrimony-error');
    const ageError = page.locator('#age-error');

    // Step 1 (Contact).
    await page.locator('#name').click();
    await page.locator('#matrimony').click(); // blurs #name
    await expect(nameError).toHaveText('Name is required');

    await page.locator('#mobile').click(); // blurs #matrimony
    await expect(matrimonyError).toHaveText('Matrimony ID is required');

    // Continue is refused while required fields are invalid; the remaining errors surface.
    await wizardContinue(page);
    await expect(heading('Contact')).toBeVisible();
    // The untouched mobile field holds the "+91" prefix, which the validator rejects as incomplete.
    await expect(page.locator('#mobile-error')).toHaveText(
      'Invalid mobile number (e.g., 98765 43210 or +91 98765 43210)',
    );
    // Status starts as New, so it has nothing to complain about.
    await expect(page.locator('#profile_status-error')).toHaveCount(0);

    // Fixing one field clears only that field's error; errors are independent.
    await page.locator('#name').fill('Validation Test');
    await expect(nameError).toHaveCount(0);
    await expect(matrimonyError).toHaveText('Matrimony ID is required');

    await page.locator('#matrimony').fill('M-Validation');
    await expect(matrimonyError).toHaveCount(0);
    await page.locator('#mobile').fill('98765 43210');
    await pickOption(page, 'hlm-select#profile_status', PROFILE_STATUS.NEW);
    await wizardContinue(page);

    // Step 2 (Horoscope).
    await expect(heading('Horoscope')).toBeVisible();
    await page.locator('#age').click();
    await page.keyboard.press('Tab'); // blurs #age
    await expect(ageError).toHaveText('Age is required');

    // Age has a second validator (min 18) beyond required: below the minimum surfaces a
    // different message than "required", and it clears live as soon as the value is fixed.
    await page.locator('#age').fill('10');
    await expect(ageError).toHaveText('Age must be at least 18');

    await page.locator('#age').fill('27');
    await expect(ageError).toHaveCount(0);

    // Zodiac sign is still unset, so the step cannot be left yet.
    await wizardContinue(page);
    await expect(heading('Horoscope')).toBeVisible();
    await expect(page.locator('#zodiac_sign-error')).toHaveText('Zodiac sign is required');
    await pickOption(page, 'hlm-select#zodiac_sign', ARIES_LABEL);
    await wizardContinue(page);

    // Step 3 (Location & notes): Save stays clickable while state and city are unset; clicking
    // it explains what is missing instead of silently doing nothing, and creates nothing.
    await expect(heading('Location & notes')).toBeVisible();
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    await expect(page.locator('#state-error')).toHaveText('State is required');
    await expect(heading('Location & notes')).toBeVisible();
    await expect(profileRows(page)).toHaveCount(0);
  });

  test('rejects mobile input that has no digits at all', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);

    await page.locator('#name').fill('No Digits Mobile Test');
    await page.locator('#matrimony').fill('M-No-Digits');
    await pickOption(page, 'hlm-select#profile_status', PROFILE_STATUS.NEW);

    const mobileError = page.locator('#mobile-error');
    for (const junk of ['N/A', 'abc', '-', '   ']) {
      await page.locator('#mobile').fill(junk);
      await page.keyboard.press('Tab');
      await expect(mobileError, `"${junk}" must be rejected`).toHaveText(
        'Invalid mobile number (e.g., 98765 43210 or +91 98765 43210)',
      );
      await wizardContinue(page);
      await expect(page.locator('#mobile')).toBeVisible(); // still on step 1
    }
  });

  test('rejects an invalid mobile number with its own message, then accepts the fix', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);

    await page.locator('#name').fill('Mobile Validation Test');
    await page.locator('#matrimony').fill('M-Mobile-Validation');
    await pickOption(page, 'hlm-select#profile_status', PROFILE_STATUS.NEW);

    // Too short and doesn't start with 6-9 — fails the custom mobile-number validator.
    await page.locator('#mobile').fill('12345');
    await page.keyboard.press('Tab'); // blur the field so its error is allowed to show
    const mobileError = page.locator('#mobile-error');
    await expect(mobileError).toHaveText(
      'Invalid mobile number (e.g., 98765 43210 or +91 98765 43210)',
    );
    await wizardContinue(page);
    await expect(page.locator('#mobile')).toBeVisible(); // still on step 1
    await expect(profileRows(page)).toHaveCount(0);

    // Fixing the number clears the error live and unlocks Continue without another blur.
    await page.locator('#mobile').fill('98765 43210');
    await expect(mobileError).toHaveCount(0);

    await wizardContinue(page);
    await pickOption(page, 'hlm-select#zodiac_sign', ARIES_LABEL);
    await page.locator('#age').fill('27');
    await wizardContinue(page);
    await pickOption(page, 'hlm-select#state', 'Tamil Nadu');
    await pickOption(page, 'hlm-select#city', 'Chennai');
    const saveButton = page.getByRole('button', { name: 'Create profile' });
    await expect(saveButton).toBeEnabled();

    await saveButton.click();
    await expect(page.getByText('Profile added successfully')).toBeVisible();
    await expect(profileRows(page)).toHaveCount(1);
  });

  test('wizard: Continue is blocked until step 1 is valid, Back keeps values, preview is live and the legacy URL redirects', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();

    // Legacy bookmark lands on the wizard.
    await page.goto('/?actionType=create&openDrawer=true');
    await expect(page).toHaveURL(/\/profiles\/new$/);
    await expect(page.getByRole('heading', { name: 'Add New Profile' })).toBeVisible();

    const preview = page.getByLabel('Live preview').and(page.locator('aside'));
    const rail = page.getByRole('navigation', { name: 'Profile creation steps' });
    await expect(rail.locator('[aria-current="step"]')).toContainText('Contact');

    // Blocked: nothing filled yet.
    await wizardContinue(page);
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#name-error')).toHaveText('Name is required');
    await expect(rail.locator('[aria-current="step"]')).toContainText('Contact');

    // The preview mirrors typed values.
    await page.locator('#name').fill('Preview Person');
    await page.locator('#matrimony').fill('M-PREVIEW');
    await page.locator('#mobile').fill('98765 43210');
    await pickOption(page, 'hlm-select#profile_status', PROFILE_STATUS.NEW);
    await expect(preview).toContainText('Preview Person');
    await expect(preview).toContainText('M-PREVIEW');
    await expect(preview).toContainText(PROFILE_STATUS.NEW);

    await wizardContinue(page);
    await expect(page.getByRole('heading', { name: 'Horoscope' })).toBeFocused();
    await expect(rail.locator('[aria-current="step"]')).toContainText('Horoscope');
    await pickOption(page, 'hlm-select#zodiac_sign', ARIES_LABEL);
    await page.locator('#age').fill('31');
    await expect(preview).toContainText(ARIES_LABEL);
    await expect(preview).toContainText('31');

    // Back keeps what was entered.
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.locator('#name')).toHaveValue('Preview Person');
    await expect(page.locator('#matrimony')).toHaveValue('M-PREVIEW');
    await wizardContinue(page);
    await expect(page.locator('#age')).toHaveValue('31');

    await fillRemainingAndSave(page);
  });
});

async function fillRemainingAndSave(page: import('@playwright/test').Page): Promise<void> {
  await wizardContinue(page);
  await pickOption(page, 'hlm-select#state', 'Tamil Nadu');
  await pickOption(page, 'hlm-select#city', 'Chennai');
  await page.getByRole('button', { name: 'Create profile' }).click();
  await expect(page.getByText('Profile added successfully')).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await expect(profileRows(page)).toHaveCount(1);
}

test.describe('wizard focus and landmarks', () => {
  const stepRail = (page: import('@playwright/test').Page) =>
    page.getByRole('navigation', { name: 'Profile creation steps' });

  test('a blocked Continue moves focus to the first invalid field of that step', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);

    // Step 1, nothing filled: focus goes to Name (not left on the Continue button).
    await wizardContinue(page);
    await expect(page.locator('#name-error')).toHaveText('Name is required');
    await expect(page.locator('#name')).toBeFocused();

    await page.locator('#name').fill('Focus Test');
    await page.locator('#matrimony').fill('M-Focus');
    await page.locator('#mobile').fill('98765 43210');
    await wizardContinue(page);
    await expect(page.getByRole('heading', { name: 'Horoscope' })).toBeFocused();

    // Step 2, nothing filled: the first invalid field is the zodiac select.
    await wizardContinue(page);
    await expect(page.locator('#zodiac_sign-error')).toHaveText('Zodiac sign is required');
    await expect(page.locator('hlm-select#zodiac_sign').getByRole('combobox')).toBeFocused();

    // Zodiac chosen, age still empty: now the age input gets focus.
    await pickOption(page, 'hlm-select#zodiac_sign', ARIES_LABEL);
    await wizardContinue(page);
    await expect(page.locator('#age-error')).toHaveText('Age is required');
    await expect(page.locator('#age')).toBeFocused();
  });

  test('jumping ahead from the step rail stops at the invalid step and focuses its field', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);

    await stepRail(page)
      .getByRole('button', { name: /Location/ })
      .click();

    await expect(stepRail(page).locator('[aria-current="step"]')).toContainText('Contact');
    await expect(page.locator('#name-error')).toHaveText('Name is required');
    await expect(page.locator('#name')).toBeFocused();
  });

  test('the live preview is exposed as a landmark at every width', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);

    // Wide: the sidebar preview is the complementary landmark; the compact one is hidden.
    await expect(page.getByRole('complementary', { name: 'Live preview' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Live preview' })).toHaveCount(0);

    // Phone: the compact preview must be a named region, not an unlabelled div.
    await page.setViewportSize({ width: 390, height: 800 });
    await expect(page.getByRole('region', { name: 'Live preview' })).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Live preview' })).toHaveCount(0);
  });
});
