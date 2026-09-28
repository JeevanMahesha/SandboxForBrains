import {
  NOT_SPECIFIED_LABEL,
  PROFILE_STATUS,
  STAR_SCORES,
  ZODIAC_LIST,
} from '../src/app/constant/common.const';
import { expect, pickOption, profileRows, test } from './support/fixtures';

// The select lists Zodiac/Star options as "<tanglish> (<english>)" / "<star> (<score>)" (see
// profile-form-fields.ts); derive expected labels/scores from the same source data rather than
// hardcoding them, so a wording or scoring change doesn't silently desync this test.
const ARIES_LABEL = `${ZODIAC_LIST.aries.tanglish} (${ZODIAC_LIST.aries.english})`;
const [firstStar, secondStar] = ZODIAC_LIST.aries.stars;
const firstStarLabel = `${firstStar} (${STAR_SCORES[firstStar]})`;
const secondStarLabel = `${secondStar} (${STAR_SCORES[secondStar]})`;

test.describe('star match score auto-calc', () => {
  test('derives the score from the selected star, recalculates on change, and clears when unset', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();

    await page.getByRole('button', { name: 'Add Profile' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Add New Profile' })).toBeVisible();

    const scoreInput = dialog.locator('#star_match_score');
    const starTrigger = dialog.locator('hlm-select#star_sign [role="combobox"]');

    // The score field is always readonly (auto-filled from the Star Sign, never hand-typed)
    // and starts empty, since no star is selected yet.
    await expect(scoreInput).toHaveAttribute('readonly', '');
    await expect(scoreInput).toHaveAttribute('placeholder', 'Auto-filled from Star Sign');
    await expect(scoreInput).toHaveValue('');

    await pickOption(page, 'hlm-select#zodiac_sign', ARIES_LABEL);

    // Selecting a star auto-populates the score from STAR_SCORES.
    await pickOption(page, 'hlm-select#star_sign', firstStarLabel);
    await expect(scoreInput).toHaveValue(String(STAR_SCORES[firstStar]));

    // Picking a different star (same zodiac) recalculates the score.
    await pickOption(page, 'hlm-select#star_sign', secondStarLabel);
    await expect(scoreInput).toHaveValue(String(STAR_SCORES[secondStar]));

    // Explicitly clearing the star via the "Not specified" option clears the score back to
    // empty. The select's trigger itself reverts to its plain "Select Star" placeholder rather
    // than showing "Not specified" as the chosen label: Brain's BrnSelect treats a null value
    // as "no selection" (isSingleValuePresent excludes null/undefined/''), so the literal
    // "Not specified" text never appears on the trigger — only as the option itself, and later
    // as the read-only view rendering (checked below).
    await pickOption(page, 'hlm-select#star_sign', NOT_SPECIFIED_LABEL);
    await expect(scoreInput).toHaveValue('');
    await expect(starTrigger).toHaveText('Select Star');

    // Save the profile with no star chosen at all.
    await dialog.locator('#name').fill('No Star Test');
    await dialog.locator('#mobile').fill('98765 43210');
    await dialog.locator('#matrimony').fill('M-NOSTAR');
    await pickOption(page, 'hlm-select#profile_status', PROFILE_STATUS.NEW);
    await dialog.locator('#age').fill('25');
    await pickOption(page, 'hlm-select#state', 'Tamil Nadu');
    await pickOption(page, 'hlm-select#city', 'Chennai');
    await dialog.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Profile added successfully')).toBeVisible();

    // Reopen it read-only: per profile-form-fields.html, this is the only place the literal
    // "Not specified" text is actually rendered — once for the Star Sign field, once for the
    // Star Match Score field (both fall back to NOT_SPECIFIED_LABEL when null).
    await profileRows(page).first().getByRole('button', { name: 'View' }).click();
    await expect(dialog.getByRole('heading', { name: 'View Profile' })).toBeVisible();
    await expect(dialog.getByText(NOT_SPECIFIED_LABEL, { exact: true })).toHaveCount(2);
  });
});
