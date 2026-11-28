import type { Page } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

// WCAG 1.4.11 (non-text contrast, 3:1): the zodiac icon on a profile card must stand out from the
// card in both themes. Colours are read from the real computed styles and composited in the
// browser (a 1x1 canvas), so the translucent glass card is measured as it is actually drawn. The
// decorative aurora backdrop behind the card is not modelled.

type Rgb = [number, number, number];

const SIGNS = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
] as const;

const luminance = ([r, g, b]: Rgb): number => {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};
const contrast = (a: Rgb, b: Rgb): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** The icon's colour and the opaque surface behind it (every ancestor's fill, over white). */
async function iconPaint(page: Page, name: string): Promise<{ icon: Rgb; surface: Rgb }> {
  return page
    .getByTestId('profile-card')
    .filter({ hasText: name })
    .evaluate((card) => {
      const wrapper = card.querySelector('span.size-4 > span')!;
      const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
      ctx.canvas.width = ctx.canvas.height = 1;
      const fill = (color: string) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
      };
      const pixel = () => Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)) as Rgb;

      fill('#ffffff');
      const ancestors: Element[] = [];
      for (let node = wrapper.parentElement; node; node = node.parentElement)
        ancestors.unshift(node);
      for (const node of ancestors) fill(getComputedStyle(node).backgroundColor);
      const surface = pixel();

      // Painted over the surface, so any alpha in the icon colour is accounted for.
      fill(getComputedStyle(wrapper).color);
      return { icon: pixel(), surface };
    });
}

for (const theme of ['light', 'dark'] as const) {
  test(`every zodiac icon is at least 3:1 against its card (${theme})`, async ({
    page,
    loginAsAdmin,
  }) => {
    // The inline script in index.html applies the stored preference before first paint.
    await page.addInitScript((value) => localStorage.setItem('theme-preference', value), theme);
    await page.emulateMedia({ colorScheme: theme });
    await seedProfiles(
      SIGNS.map((sign, index) =>
        makeProfile(index, { name: `Sign ${sign}`, matrimonyId: `Z-${sign}`, zodiacSign: sign }),
      ),
    );
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(SIGNS.length);
    await expect(page.locator('html')).toHaveClass(theme === 'dark' ? /dark/ : /^(?!.*dark).*$/);

    const failures: string[] = [];
    for (const sign of SIGNS) {
      const { icon, surface } = await iconPaint(page, `Sign ${sign}`);
      const ratio = contrast(icon, surface);
      if (ratio < 3) failures.push(`${sign} ${ratio.toFixed(2)}:1 (icon ${icon}, card ${surface})`);
    }
    expect(failures, 'zodiac icons below 3:1').toEqual([]);
  });
}
