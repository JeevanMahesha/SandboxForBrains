import { PROFILE_STATUS } from '../src/app/constant/common.const';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, pickOption, profileRows, profilesTotal, test } from './support/fixtures';

test.describe('sort order, page size and clear filters', () => {
  test('toggles sort order and re-sorts the list', async ({ page, loginAsAdmin }) => {
    await seedProfiles([
      makeProfile(0, { name: 'Alice Oldest' }),
      makeProfile(1, { name: 'Bob Middle' }),
      makeProfile(2, { name: 'Carol Newest' }),
    ]);
    await loginAsAdmin();

    const rows = profileRows(page);
    // Default order is "Oldest First" (ascending by createdAt).
    await expect(rows).toHaveCount(3);
    await expect(rows.nth(0)).toContainText('Alice Oldest');
    await expect(rows.nth(1)).toContainText('Bob Middle');
    await expect(rows.nth(2)).toContainText('Carol Newest');

    await page.getByRole('combobox').filter({ hasText: 'Oldest First' }).click();
    await page.getByRole('option', { name: 'Newest First', exact: true }).click();

    await expect(rows.nth(0)).toContainText('Carol Newest');
    await expect(rows.nth(1)).toContainText('Bob Middle');
    await expect(rows.nth(2)).toContainText('Alice Oldest');
  });

  test('changing the page size shows more rows on one page', async ({ page, loginAsAdmin }) => {
    await seedProfiles(Array.from({ length: 15 }, (_, index) => makeProfile(index)));
    await loginAsAdmin();

    await expect(profileRows(page)).toHaveCount(10);
    await expect(profilesTotal(page)).toHaveText(/In total there are 15 profiles\./);

    await pickOption(page, 'hlm-numbered-pagination', '25');

    await expect(profileRows(page)).toHaveCount(15);
    await expect(profilesTotal(page)).toHaveText(/In total there are 15 profiles\./);
  });

  test('"Clear" resets an active filter back to showing everything', async ({
    page,
    loginAsAdmin,
  }) => {
    // 12 profiles: 8 NEW and 4 ACCEPTED.
    await seedProfiles(
      Array.from({ length: 12 }, (_, index) =>
        makeProfile(index, { profileStatusId: index < 8 ? 'NEW' : 'ACCEPTED' }),
      ),
    );
    await loginAsAdmin();

    const clearButton = page.getByRole('button', { name: 'Clear', exact: true });
    await expect(profileRows(page)).toHaveCount(10);
    await expect(clearButton).toBeDisabled();

    await page.getByRole('combobox').filter({ hasText: 'Select Status' }).click();
    await page.getByRole('option', { name: PROFILE_STATUS.ACCEPTED, exact: true }).click();

    await expect(profileRows(page)).toHaveCount(4);
    await expect(clearButton).toBeEnabled();

    await clearButton.click();

    await expect(profileRows(page)).toHaveCount(10);
    await expect(profilesTotal(page)).toHaveText(/In total there are 12 profiles\./);
    await expect(clearButton).toBeDisabled();
    await expect(page.getByRole('combobox').filter({ hasText: 'Select Status' })).toBeVisible();
  });
});

test.describe('combined filters', () => {
  test('narrows to the intersection of a status filter and a star-match filter', async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([
      makeProfile(0, { name: 'New Six', profileStatusId: 'NEW', starMatchScore: 6 }),
      makeProfile(1, { name: 'New Eight', profileStatusId: 'NEW', starMatchScore: 8 }),
      makeProfile(2, { name: 'Accepted Six', profileStatusId: 'ACCEPTED', starMatchScore: 6 }),
      makeProfile(3, { name: 'Accepted Eight', profileStatusId: 'ACCEPTED', starMatchScore: 8 }),
    ]);
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(4);

    await page.getByRole('combobox').filter({ hasText: 'Select Status' }).click();
    await page.getByRole('option', { name: PROFILE_STATUS.ACCEPTED, exact: true }).click();
    await expect(profileRows(page)).toHaveCount(2);

    await page.getByRole('combobox').filter({ hasText: 'Select Star' }).click();
    await page.getByRole('option', { name: '6', exact: true }).click();

    await expect(profileRows(page)).toHaveCount(1);
    await expect(profileRows(page).first()).toContainText('Accepted Six');
    await expect(profilesTotal(page)).toHaveText(/In total there are 1 profiles\./);
  });
});
