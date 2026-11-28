import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

// The longest content the status row can hold: the longest status label, the longest zodiac
// label and the longest city name.
const LONGEST = makeProfile(0, {
  name: 'Venkataraghavan Subramaniam Iyer',
  profileStatusId: 'MEETING_SCHEDULED',
  zodiacSign: 'scorpio',
  city: 'Thoothukudi (Tuticorin)',
});

for (const width of [320, 360, 390]) {
  test(`status row shows the zodiac and city in full, and the pill stays inside the card at ${width}px`, async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles([LONGEST]);
    await page.setViewportSize({ width, height: 640 });
    await loginAsAdmin();
    const card = profileRows(page).first();
    await expect(card).toBeVisible();

    const m = await card.evaluate((el) => {
      const pill = el.querySelector('app-status-menu')!;
      const row = pill.parentElement!;
      const cardBox = el.getBoundingClientRect();
      const texts = [...row.querySelectorAll<HTMLElement>('span.truncate')].map((t) => ({
        text: t.textContent!.trim(),
        clipped: t.scrollWidth > t.clientWidth,
        width: Math.round(t.clientWidth),
      }));
      const rowBox = row.getBoundingClientRect();
      return {
        texts,
        pillInsideCard: pill.getBoundingClientRect().right <= cardBox.right,
        rowOverflowsCard: row.scrollWidth > row.clientWidth || rowBox.right > cardBox.right + 0.5,
      };
    });
    await page.screenshot({ path: `/private/tmp/claude-501/ui12-${width}.png` });

    expect(m.pillInsideCard).toBe(true);
    expect(m.rowOverflowsCard).toBe(false);
    // The zodiac and city wrap onto their own line instead of being squeezed to "V…" / "T…".
    for (const t of m.texts) {
      expect(t.clipped, `"${t.text}" is cut off at ${t.width}px`).toBe(false);
    }
  });
}
