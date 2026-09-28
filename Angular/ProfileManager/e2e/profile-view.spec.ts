import { PROFILE_STATUS, STAR_SCORES, ZODIAC_LIST } from '../src/app/constant/common.const';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

const ARIES_LABEL = `${ZODIAC_LIST.aries.tanglish} (${ZODIAC_LIST.aries.english})`;
const ASHWINI_LABEL = `Ashwini (${STAR_SCORES.Ashwini})`;

test.describe('view profile drawer', () => {
  test('shows every field as read-only text, with no edit controls', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([
      makeProfile(0, {
        name: 'Read Only Test',
        profileStatusId: 'ACCEPTED',
        zodiacSign: 'aries',
        star: 'Ashwini',
        starMatchScore: STAR_SCORES.Ashwini,
        city: 'Coimbatore',
      }),
    ]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'View' }).click();
    // Not scoped by accessible name: it tracks the heading, which changes to "Edit Profile" below.
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'View Profile' })).toBeVisible();

    // Values render as plain text, derived from the profile...
    // (the sheet header repeats name/status, so these two match twice by design)
    await expect(dialog.getByText('Read Only Test').first()).toBeVisible();
    await expect(dialog.getByText(PROFILE_STATUS.ACCEPTED).first()).toBeVisible();
    await expect(dialog.getByText(ARIES_LABEL)).toBeVisible();
    await expect(dialog.getByText(ASHWINI_LABEL)).toBeVisible();
    await expect(dialog.getByText('Coimbatore')).toBeVisible();

    // ...never as editable inputs: these ids only exist in the create/edit template branch.
    for (const id of ['#name', '#mobile', '#matrimony', '#age', '#comment']) {
      await expect(dialog.locator(id)).toHaveCount(0);
    }

    // No "Add Comment" affordance, and the footer offers Close/Edit, not a save action.
    await expect(dialog.getByText('Add Comment')).toHaveCount(0);
    await expect(dialog.getByRole('button', { name: 'Save Changes' })).toHaveCount(0);
    await expect(dialog.getByRole('button', { name: 'Update Profile' })).toHaveCount(0);

    // Edit is one click away from View, reusing the same drawer.
    await dialog.getByRole('button', { name: 'Edit' }).click();
    await expect(dialog.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
    await expect(dialog.locator('#name')).toHaveValue('Read Only Test');
  });
});
