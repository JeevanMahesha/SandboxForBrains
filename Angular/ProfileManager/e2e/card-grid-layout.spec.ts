import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

// 12 profiles = exactly one page (page size 12), so every row of the 1 / 2 / 3 column grid is
// full. Content is deliberately uneven (very long name and city, scored and unscored cards) to
// prove that content never changes a card's size or its spacing.
const LONG_NAME = 'Priyadharshini Venkataraghavan Subramaniam';
const LONG_CITY = 'Thoothukudi (Tuticorin)';

const UNSCORED = new Set([0, 3, 6, 9]);

interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
  height: number;
}

const near = (a: number, b: number, tolerance = 1) => Math.abs(a - b) <= tolerance;

test.describe('card grid layout', () => {
  test.beforeEach(async () => {
    await seedProfiles(
      Array.from({ length: 12 }, (_, index) =>
        makeProfile(index, {
          name: index === 4 ? LONG_NAME : `Seed Profile ${String(index + 1).padStart(2, '0')}`,
          city: index === 7 ? LONG_CITY : 'Chennai',
          starMatchScore: UNSCORED.has(index) ? null : 6 + (index % 3),
        }),
      ),
    );
  });

  for (const { width, columns } of [
    { width: 1476, columns: 3 },
    { width: 1024, columns: 2 },
    { width: 768, columns: 2 },
    { width: 390, columns: 1 },
  ]) {
    test(`cards are evenly spaced and equally sized at ${width}px`, async ({
      page,
      loginAsAdmin,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await loginAsAdmin();

      const cards = profileRows(page);
      await expect(cards).toHaveCount(12);

      const { boxes, viewportWidth } = await cards.evaluateAll((elements) => ({
        viewportWidth: document.documentElement.clientWidth,
        boxes: elements.map((element) => {
          const r = element.getBoundingClientRect();
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, height: r.height };
        }),
      }));

      // Group into rows by top edge.
      const rows: Box[][] = [];
      for (const box of boxes) {
        const row = rows.find((candidate) => near(candidate[0].top, box.top, 2));
        if (row) row.push(box);
        else rows.push([box]);
      }
      expect(rows.length).toBe(12 / columns);
      for (const row of rows) {
        expect(row).toHaveLength(columns);
      }

      // Every card in a row has the same height, whatever its content.
      for (const row of rows) {
        for (const box of row) expect(near(box.height, row[0].height)).toBe(true);
      }

      // Horizontal gaps between neighbours are all equal; vertical gaps between rows too.
      const columnGaps = rows.flatMap((row) =>
        row.slice(1).map((box, index) => box.left - row[index].right),
      );
      const rowGaps = rows.slice(1).map((row, index) => row[0].top - rows[index][0].bottom);
      const gap = rowGaps[0];
      for (const columnGap of columnGaps) expect(near(columnGap, gap)).toBe(true);
      for (const rowGap of rowGaps) expect(near(rowGap, gap)).toBe(true);

      // Left and right page padding are equal.
      const first = rows[0][0];
      const last = rows[0][rows[0].length - 1];
      expect(near(first.left, viewportWidth - last.right)).toBe(true);
    });
  }

  test('cards without a star score show an empty placeholder ring of the same size', async ({
    page,
    loginAsAdmin,
  }) => {
    await page.setViewportSize({ width: 1476, height: 900 });
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(12);

    const placeholders = page.getByRole('img', { name: 'Star match score not specified' });
    await expect(placeholders).toHaveCount(UNSCORED.size);

    const sizes = await profileRows(page).evaluateAll((cards) =>
      cards.map((card) => {
        const ring =
          card.querySelector('app-score-ring [role="img"]') ??
          card.querySelector('app-score-ring > span');
        const r = ring?.getBoundingClientRect();
        return r ? Math.round(r.width) : 0;
      }),
    );
    // Scored (ring) and unscored (placeholder) cards use the same 44px footprint.
    for (const size of sizes) expect(size).toBe(44);
  });
});
