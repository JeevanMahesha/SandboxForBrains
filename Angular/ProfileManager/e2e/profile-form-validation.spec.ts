import { PROFILE_STATUS, ZODIAC_LIST } from '../src/app/constant/common.const';
import { expect, pickOption, profileRows, test } from './support/fixtures';

// The select lists options as "<tanglish> (<english>)" (see zodiacToLabel in
// profile-form-fields.ts) — same derivation as profile-create.spec.ts.
const ARIES_LABEL = `${ZODIAC_LIST.aries.tanglish} (${ZODIAC_LIST.aries.english})`;

test.describe('profile form validation', () => {
  test('shows inline errors for empty required fields and disables Save until fixed', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await page.getByRole('button', { name: 'Add Profile' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Add New Profile' })).toBeVisible();

    const saveButton = page.getByRole('button', { name: 'Save Changes' });

    // The form is invalid from the moment it opens (required fields are blank), so Save is
    // already disabled — but nothing has been touched yet, so no error text is shown.
    await expect(saveButton).toBeDisabled();
    await expect(dialog.getByRole('alert')).toHaveCount(0);

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
    const nameError = dialog.locator('#name-error');
    const matrimonyError = dialog.locator('#matrimony-error');
    const ageError = dialog.locator('#age-error');

    await page.locator('#name').click();
    await page.locator('#matrimony').click(); // blurs #name
    await expect(nameError).toHaveText('Name is required');

    await page.locator('#age').click(); // blurs #matrimony
    await expect(matrimonyError).toHaveText('Matrimony ID is required');

    await page.keyboard.press('Tab'); // blurs #age
    await expect(ageError).toHaveText('Age is required');

    await expect(saveButton).toBeDisabled();
    await expect(profileRows(page)).toHaveCount(0);

    // Fixing one field clears only that field's error; errors are independent, and Save stays
    // disabled while the rest of the required fields remain empty.
    await page.locator('#name').fill('Validation Test');
    await expect(nameError).toHaveCount(0);
    await expect(saveButton).toBeDisabled();

    await page.locator('#matrimony').fill('M-Validation');
    await expect(matrimonyError).toHaveCount(0);

    // Age has a second validator (min 18) beyond required: below the minimum surfaces a
    // different message than "required", and it clears live as soon as the value is fixed.
    await page.locator('#age').fill('10');
    await expect(ageError).toHaveText('Age must be greater than 18');
    await expect(saveButton).toBeDisabled();

    await page.locator('#age').fill('27');
    await expect(ageError).toHaveCount(0);

    // Still disabled: zodiac sign, profile status, state, city and a valid mobile number are
    // all untouched/unset.
    await expect(saveButton).toBeDisabled();
  });

  test('rejects an invalid mobile number with its own message, then accepts the fix', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await page.getByRole('button', { name: 'Add Profile' }).click();
    const dialog = page.getByRole('dialog');
    const saveButton = page.getByRole('button', { name: 'Save Changes' });

    await page.locator('#name').fill('Mobile Validation Test');
    await page.locator('#matrimony').fill('M-Mobile-Validation');
    await pickOption(page, 'hlm-select#profile_status', PROFILE_STATUS.NEW);
    await pickOption(page, 'hlm-select#zodiac_sign', ARIES_LABEL);
    await page.locator('#age').fill('27');
    await pickOption(page, 'hlm-select#state', 'Tamil Nadu');
    await pickOption(page, 'hlm-select#city', 'Chennai');

    // Too short and doesn't start with 6-9 — fails the custom mobile-number validator.
    await page.locator('#mobile').fill('12345');
    await page.keyboard.press('Tab'); // blur the field so its error is allowed to show
    const mobileError = dialog.locator('#mobile-error');
    await expect(mobileError).toHaveText(
      'Invalid mobile number (e.g., 98765 43210 or +91 98765 43210)',
    );
    await expect(saveButton).toBeDisabled();
    await expect(profileRows(page)).toHaveCount(0);

    // Fixing the number clears the error live and unlocks Save without needing another blur.
    await page.locator('#mobile').fill('98765 43210');
    await expect(mobileError).toHaveCount(0);
    await expect(saveButton).toBeEnabled();

    await saveButton.click();
    await expect(page.getByText('Profile added successfully')).toBeVisible();
    await expect(profileRows(page)).toHaveCount(1);
  });
});
