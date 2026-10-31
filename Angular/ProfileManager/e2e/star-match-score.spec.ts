import {
  NOT_SPECIFIED_LABEL,
  PROFILE_STATUS,
  STAR_SCORES,
  ZODIAC_LIST,
} from '../src/app/constant/common.const';
import {
  expect,
  openNewProfileWizard,
  pickOption,
  profileRows,
  test,
  wizardContinue,
} from './support/fixtures';

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

    await openNewProfileWizard(page);
    // Contact is step 1; the horoscope fields (zodiac, star, score) are step 2.
    await page.locator('#name').fill('No Star Test');
    await page.locator('#mobile').fill('98765 43210');
    await page.locator('#matrimony').fill('M-NOSTAR');
    await pickOption(page, 'hlm-select#profile_status', PROFILE_STATUS.NEW);
    await wizardContinue(page);

    const scoreInput = page.locator('#star_match_score');
    const starTrigger = page.locator('hlm-select#star_sign [role="combobox"]');

    // The score is a read-only ring (derived from the Star Sign, never hand-typed), exposed as
    // an image whose accessible name carries the value; it starts empty (no star selected yet).
    const noScore = 'Star match score not calculated';
    const scoreOf = (star: keyof typeof STAR_SCORES) => `Star match score ${STAR_SCORES[star]}`;
    await expect(page.getByText('Calculated from the selected star')).toBeVisible();
    await expect(scoreInput).toHaveAttribute('role', 'img');
    await expect(scoreInput).toHaveAttribute('aria-label', noScore);

    await pickOption(page, 'hlm-select#zodiac_sign', ARIES_LABEL);

    // Selecting a star auto-populates the score from STAR_SCORES.
    await pickOption(page, 'hlm-select#star_sign', firstStarLabel);
    await expect(scoreInput).toHaveAttribute('aria-label', scoreOf(firstStar));

    // Picking a different star (same zodiac) recalculates the score.
    await pickOption(page, 'hlm-select#star_sign', secondStarLabel);
    await expect(scoreInput).toHaveAttribute('aria-label', scoreOf(secondStar));

    // Explicitly clearing the star via the "Not specified" option clears the score back to
    // empty. The select's trigger itself reverts to its plain "Select Star" placeholder rather
    // than showing "Not specified" as the chosen label: Brain's BrnSelect treats a null value
    // as "no selection" (isSingleValuePresent excludes null/undefined/''), so the literal
    // "Not specified" text never appears on the trigger — only as the option itself, and later
    // as the read-only view rendering (checked below).
    await pickOption(page, 'hlm-select#star_sign', NOT_SPECIFIED_LABEL);
    await expect(scoreInput).toHaveAttribute('aria-label', noScore);
    await expect(starTrigger).toHaveText('Select Star');

    // Save the profile with no star chosen at all.
    await page.locator('#age').fill('25');
    await wizardContinue(page);
    await pickOption(page, 'hlm-select#state', 'Tamil Nadu');
    await pickOption(page, 'hlm-select#city', 'Chennai');
    await page.getByRole('button', { name: 'Create profile' }).click();
    await expect(page.getByText('Profile added successfully')).toBeVisible();

    // Reopen it read-only: per profile-form-fields.html, this is the only place the literal
    // "Not specified" text is actually rendered — once for the Star Sign field, once for the
    // Star Match Score field (both fall back to NOT_SPECIFIED_LABEL when null).
    await profileRows(page).first().getByRole('button', { name: 'View' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'View Profile' })).toBeVisible();
    await expect(dialog.getByText(NOT_SPECIFIED_LABEL, { exact: true })).toHaveCount(2);
  });
});
