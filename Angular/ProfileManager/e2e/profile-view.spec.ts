import { PROFILE_STATUS, STAR_SCORES, ZODIAC_LIST } from '../src/app/constant/common.const';
import { clearFirestore, makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

const ARIES_LABEL = `${ZODIAC_LIST.aries.tanglish} (${ZODIAC_LIST.aries.english})`;
const ASHWINI_LABEL = `Ashwini (${STAR_SCORES.Ashwini})`;

test.describe('view profile drawer', () => {
  test('call and WhatsApp links use the stored number and a neutral, unprefilled chat', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { mobileNumber: '+919876543210' })]);
    await loginAsAdmin();

    await profileRows(page).first().getByRole('button', { name: 'View' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'View Profile' })).toBeVisible();

    await expect(dialog.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute(
      'href',
      'https://wa.me/919876543210',
    );
    await expect(dialog.getByRole('link', { name: 'Call' })).toHaveAttribute(
      'href',
      'tel:+919876543210',
    );
  });

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

    // The footer offers Close/Edit, not a save action. (The edit-form note field, #comment, is
    // already ruled out above; the quick-note box is the one note input View legitimately has.)
    await expect(dialog.getByRole('button', { name: 'Save Changes' })).toHaveCount(0);
    await expect(dialog.getByRole('button', { name: 'Update Profile' })).toHaveCount(0);

    // Edit is one click away from View, reusing the same drawer.
    await dialog.getByRole('button', { name: 'Edit' }).click();
    await expect(dialog.getByRole('heading', { name: 'Edit Profile' })).toBeVisible();
    await expect(dialog.locator('#name')).toHaveValue('Read Only Test');
  });

  test('closes with a message when the profile was deleted elsewhere', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([makeProfile(0, { name: 'Deleted Elsewhere' })]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(1);

    // Delete behind the app's back: the list still shows the stale row.
    await clearFirestore();
    await profileRows(page).first().getByRole('button', { name: 'View' }).click();

    await expect(page.getByText('Profile not found')).toBeVisible();
    await expect(page.getByRole('dialog')).toBeHidden();
    // The stale row is gone once the list refreshes.
    await expect(profileRows(page)).toHaveCount(0);
  });
});
