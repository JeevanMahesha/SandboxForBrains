import { ARIES_LABEL } from './support/constants';
import { PROFILE_STATUS, STAR_SCORES } from '../src/app/constant/common.const';
import { makeProfile, readStoredProfiles, seedProfiles } from './support/emulator';
import {
  expect,
  fillWizardProfile,
  leaveWizardAndDiscard,
  openNewProfileWizard,
  openProfileDrawer,
  profileRows,
  profilesTotal,
  selectStatusFilter,
  statusFilter,
  test,
} from './support/fixtures';

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

  test('round-trips every field to Firestore and the View drawer', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();

    await openNewProfileWizard(page);
    // A non-default value for every field that has a default, so a dropped field cannot hide
    // behind the wizard's initial state.
    await fillWizardProfile(page, {
      name: 'Round Trip',
      mobile: '98 765 43 210',
      matrimonyId: 'M-ROUND-1',
      status: PROFILE_STATUS.MEETING_SCHEDULED,
      zodiac: ARIES_LABEL,
      star: `Bharani (${STAR_SCORES.Bharani})`,
      age: '31',
      state: 'Kerala',
      city: 'Ernakulam',
    });
    await page.locator('#comment').fill('First call went well');
    await page.getByRole('button', { name: 'Add note' }).click();
    await expect(page.getByRole('button', { name: 'Delete note' })).toHaveCount(1);
    await page.getByRole('button', { name: 'Create profile' }).click();
    await expect(page.getByText('Profile added successfully')).toBeVisible();

    // What reached Firestore: every field, the canonical number and the derived score.
    const [stored] = await readStoredProfiles();
    expect(stored['name']).toEqual({ stringValue: 'Round Trip' });
    expect(stored['mobileNumber']).toEqual({ stringValue: '+919876543210' });
    expect(stored['matrimonyId']).toEqual({ stringValue: 'M-ROUND-1' });
    expect(stored['profileStatusId']).toEqual({ stringValue: 'MEETING_SCHEDULED' });
    expect(stored['zodiacSign']).toEqual({ stringValue: 'aries' });
    expect(stored['star']).toEqual({ stringValue: 'Bharani' });
    expect(stored['starMatchScore']).toEqual({ integerValue: String(STAR_SCORES.Bharani) });
    expect(stored['age']).toEqual({ integerValue: '31' });
    expect(stored['state']).toEqual({ stringValue: 'Kerala' });
    expect(stored['city']).toEqual({ stringValue: 'Ernakulam' });
    expect(stored['createdAt']).toHaveProperty('timestampValue');
    expect(JSON.stringify(stored['comments'])).toContain('First call went well');

    // What the app shows back: the same values in the read-only View drawer.
    await openProfileDrawer(page, 'View');
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'View Profile' })).toBeVisible();
    await expect(dialog.getByText('Round Trip').first()).toBeVisible();
    await expect(dialog.getByText('M-ROUND-1').first()).toBeVisible();
    await expect(dialog.getByText('+919876543210').first()).toBeVisible();
    await expect(dialog.getByText(PROFILE_STATUS.MEETING_SCHEDULED).first()).toBeVisible();
    await expect(dialog.getByText(ARIES_LABEL)).toBeVisible();
    await expect(dialog.getByText(`Bharani (${STAR_SCORES.Bharani})`)).toBeVisible();
    await expect(dialog.getByText('Ernakulam')).toBeVisible();
    await expect(dialog.getByText('Kerala')).toBeVisible();
    await expect(dialog.getByText('First call went well')).toBeVisible();
    await expect(
      dialog.getByRole('img', { name: `Star match score ${STAR_SCORES.Bharani}` }),
    ).toBeVisible();
  });

  test('stores name and matrimony ID without stray spaces so exact search finds them', async ({
    page,
    loginAsAdmin,
  }) => {
    // A second profile makes the search discriminating: it must narrow 2 down to 1.
    await seedProfiles([makeProfile(0, { name: 'Other Profile', matrimonyId: 'M-OTHER-1' })]);
    await loginAsAdmin();

    await openNewProfileWizard(page);
    await fillWizardProfile(page, {
      name: '  Padded Name  ',
      mobile: '98765 43210',
      matrimonyId: '  M-PAD-1  ',
      status: PROFILE_STATUS.NEW,
      zodiac: ARIES_LABEL,
      age: '27',
      state: 'Tamil Nadu',
      city: 'Chennai',
    });
    await page.getByRole('button', { name: 'Create profile' }).click();
    await expect(page.getByText('Profile added successfully')).toBeVisible();
    await expect(profilesTotal(page)).toHaveText(/^2 profiles$/);

    // The search box trims what is typed and matches matrimonyId exactly.
    await page.getByPlaceholder('Search by full ID or phone').fill('M-PAD-1');
    await page.getByPlaceholder('Search by full ID or phone').press('Enter');
    await expect(profilesTotal(page)).toHaveText(/^1 profile$/);
    await expect(profileRows(page)).toHaveCount(1);
    await expect(profileRows(page).first()).toContainText('Padded Name');
  });

  test('saves status New when the status is never touched', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);
    await fillWizardProfile(page, {
      name: 'Default Status',
      mobile: '98765 43210',
      matrimonyId: 'M-DEFAULT',
      zodiac: ARIES_LABEL,
      age: '27',
      state: 'Tamil Nadu',
      city: 'Chennai',
    });
    await page.getByRole('button', { name: 'Create profile' }).click();
    await expect(page.getByText('Profile added successfully')).toBeVisible();

    const [stored] = await readStoredProfiles();
    expect(stored['profileStatusId']).toEqual({ stringValue: 'NEW' });
  });

  test('does not carry an abandoned draft into the next Add Profile', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();

    await openNewProfileWizard(page);
    await page.locator('#name').fill('Abandoned Draft');
    // Leave through the "back to the list" link instead of saving (and confirm the discard).
    await leaveWizardAndDiscard(page);
    await expect(page).toHaveURL(/\/$/);

    await openNewProfileWizard(page);
    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('hlm-select#profile_status')).toContainText(PROFILE_STATUS.NEW);
  });

  test('leaves without a prompt when nothing was typed', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);
    // The untouched "+91" prefix and the default status do not count as input.
    await expect(page.locator('#mobile')).toHaveValue('+91');
    await expect(page.locator('hlm-select#profile_status')).toContainText(PROFILE_STATUS.NEW);
    await page.getByRole('link', { name: 'Back to profiles' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('asks before discarding typed input; cancel keeps the data, confirm leaves', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);
    await page.locator('#name').fill('Keep Me');

    const dialog = page.getByRole('dialog', { name: 'Discard this new profile?' });
    await page.getByRole('link', { name: 'Back to profiles' }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page).toHaveURL(/\/profiles\/new$/);
    await expect(page.locator('#name')).toHaveValue('Keep Me');

    // Browser back goes through the same guard.
    await page.goBack();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Discard' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('shows per-step required-field progress and marks required fields', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);
    const rail = page.getByRole('navigation', { name: 'Profile creation steps' });
    // Status starts as New, so it already counts as done.
    await expect(rail.getByText('1 of 4 required fields done')).toBeVisible();
    await expect(rail.getByText('0 of 2 required fields done')).toHaveCount(2);

    await page.locator('#name').fill('Counter Test');
    await expect(rail.getByText('2 of 4 required fields done')).toBeVisible();
    await page.locator('#mobile').fill('98765 43210');
    await page.locator('#matrimony').fill('M-COUNT');
    await expect(rail.getByText('4 of 4 required fields done')).toBeVisible();

    // Required labels carry an asterisk after the text.
    const mark = await page
      .locator('label[for="name"]')
      .evaluate((el) => getComputedStyle(el, '::after').content);
    expect(mark).toContain('*');
  });

  test('pins Back/Continue to a bottom bar on phones', async ({ page, loginAsAdmin }) => {
    await page.setViewportSize({ width: 390, height: 700 });
    await loginAsAdmin();
    await openNewProfileWizard(page);
    const box = await page.getByRole('button', { name: 'Continue' }).boundingBox();
    expect(box).not.toBeNull();
    // Continue sits in the fixed bar at the very bottom of the viewport, not under the fields.
    expect(box!.y + box!.height).toBeGreaterThan(700 - 40);
  });
});

test.describe('after creating a profile', () => {
  const newProfile = (name: string, status: string) => ({
    name,
    mobile: '98765 43299',
    matrimonyId: 'M-AFTER-CREATE',
    status,
    zodiac: ARIES_LABEL,
    age: '27',
    state: 'Tamil Nadu',
    city: 'Chennai',
  });

  test.beforeEach(async () => {
    // 14 profiles: 8 NEW and 6 ACCEPTED. Page size is 12, so page 2 holds the last 2.
    await seedProfiles(
      Array.from({ length: 14 }, (_, index) =>
        makeProfile(index, { profileStatusId: index < 8 ? 'NEW' : 'ACCEPTED' }),
      ),
    );
  });

  test('returns to the first page with the new profile on top', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(12);

    const pagination = page.getByRole('navigation', { name: 'pagination' });
    await pagination.getByText('2', { exact: true }).click();
    await expect(profileRows(page)).toHaveCount(2);

    await openNewProfileWizard(page);
    await fillWizardProfile(page, newProfile('Fresh Arrival', PROFILE_STATUS.NEW));
    await page.getByRole('button', { name: 'Create profile' }).click();
    await expect(page.getByText('Profile added successfully')).toBeVisible();

    await expect(profilesTotal(page)).toHaveText(/^15 profiles$/);
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('1');
    await expect(profileRows(page)).toHaveCount(12);
    await expect(profileRows(page).first()).toContainText('Fresh Arrival');
  });

  test('clears an active filter that would hide the new profile', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await selectStatusFilter(page, PROFILE_STATUS.ACCEPTED);
    await expect(profilesTotal(page)).toHaveText(/^6 profiles$/);

    await openNewProfileWizard(page);
    await fillWizardProfile(page, newProfile('Hidden By Filter', PROFILE_STATUS.NEW));
    await page.getByRole('button', { name: 'Create profile' }).click();
    await expect(page.getByText('Profile added successfully')).toBeVisible();

    await expect(statusFilter(page)).toContainText('All statuses');
    await expect(profilesTotal(page)).toHaveText(/^15 profiles$/);
    await expect(profileRows(page).first()).toContainText('Hidden By Filter');
  });
});

test.describe('duplicate profiles', () => {
  const DUPLICATE_MOBILE_MESSAGE = 'This mobile number already belongs to Ravi Kumar (M1000)';
  const wizardProfile = (overrides: Partial<Parameters<typeof fillWizardProfile>[1]> = {}) => ({
    name: 'New Person',
    mobile: '98765 11111',
    matrimonyId: 'M-NEW-1',
    status: PROFILE_STATUS.NEW,
    zodiac: ARIES_LABEL,
    age: '27',
    state: 'Tamil Nadu',
    city: 'Chennai',
    ...overrides,
  });

  test.beforeEach(async () => {
    // Seeded profile 0 has ID M1000 and mobile +919876543200.
    await seedProfiles([makeProfile(0, { name: 'Ravi Kumar' })]);
  });

  test('blocks an existing Matrimony ID at Continue and names its owner', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);
    await page.locator('#name').fill('New Person');
    await page.locator('#mobile').fill('98765 11111');
    await page.locator('#matrimony').fill('M1000');

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.locator('#matrimony-error')).toHaveText(
      'Matrimony ID M1000 already belongs to Ravi Kumar',
    );
    await expect(page.locator('#name')).toBeVisible(); // still on step 1

    // Editing the field clears the error and lets the user move on.
    await page.locator('#matrimony').fill('M-NEW-1');
    await expect(page.locator('#matrimony-error')).toHaveCount(0);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.locator('#age')).toBeVisible();
  });

  test('blocks an existing mobile number even when typed in another format', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);
    await page.locator('#name').fill('New Person');
    await page.locator('#mobile').fill('98765 43200'); // stored as +919876543200
    await page.locator('#matrimony').fill('M-NEW-1');

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.locator('#mobile-error')).toHaveText(DUPLICATE_MOBILE_MESSAGE);
    await expect(page.locator('#matrimony-error')).toHaveCount(0);
    await expect(page.locator('#name')).toBeVisible();
  });

  test('a profile with a new ID and number still saves', async ({ page, loginAsAdmin }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);
    await fillWizardProfile(page, wizardProfile());
    await page.getByRole('button', { name: 'Create profile' }).click();

    await expect(page.getByText('Profile added successfully')).toBeVisible();
    await expect(profilesTotal(page)).toHaveText(/^2 profiles$/);
  });

  test('re-checks on save and jumps back to the field if the ID was taken meanwhile', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    await openNewProfileWizard(page);
    await fillWizardProfile(page, wizardProfile({ matrimonyId: 'M-RACE' }));

    // Someone else registers the same ID while this wizard sits on its last step.
    await seedProfiles([makeProfile(1, { name: 'Late Arrival', matrimonyId: 'M-RACE' })]);

    await page.getByRole('button', { name: 'Create profile' }).click();
    await expect(page.locator('#matrimony-error')).toHaveText(
      'Matrimony ID M-RACE already belongs to Late Arrival',
    );
    await expect(page.getByText('Profile added successfully')).toHaveCount(0);
  });
});
