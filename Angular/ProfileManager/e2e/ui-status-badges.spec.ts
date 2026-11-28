import type { Page } from '@playwright/test';
import { PROFILE_STATUS } from '../src/app/constant/common.const';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

// Every status pill must stay readable (WCAG 1.4.3, 4.5:1) in both themes, and must follow the
// theme: a pale pastel block on the dark glass is the failure this guards against. Colours are
// read from the real computed styles and composited in the browser (a 1x1 canvas) over the
// backgrounds of the pill's ancestors. The decorative aurora backdrop is not modelled.

type Rgb = [number, number, number];
const STATUS_KEYS = Object.keys(PROFILE_STATUS) as (keyof typeof PROFILE_STATUS)[];

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

/** The pill's text colour and its opaque fill (own background over every ancestor), as drawn. */
async function paintBadge(page: Page, name: string): Promise<{ text: Rgb; fill: Rgb }> {
  const badge = profileRows(page).filter({ hasText: name }).getByTestId('status-trigger');
  await expect(badge).toBeVisible();
  return badge.evaluate((el) => {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
    ctx.canvas.width = ctx.canvas.height = 1;
    const fill = (color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
    };
    const pixel = () => Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)) as Rgb;

    fill('#ffffff');
    const chain: Element[] = [];
    for (let node: Element | null = el; node; node = node.parentElement) chain.unshift(node);
    for (const node of chain) fill(getComputedStyle(node).backgroundColor);
    const filled = pixel();

    fill(`rgb(${filled.join(',')})`);
    fill(getComputedStyle(el).color);
    return { text: pixel(), fill: filled };
  });
}

for (const theme of ['light', 'dark'] as const) {
  test(`status pills are readable and follow the theme (${theme})`, async ({
    page,
    loginAsAdmin,
  }) => {
    await seedProfiles(
      STATUS_KEYS.map((key, index) =>
        makeProfile(index, { name: `Badge ${key}`, profileStatusId: key }),
      ),
    );
    await page.emulateMedia({ colorScheme: 'light' });
    await loginAsAdmin();
    await expect(profileRows(page)).toHaveCount(STATUS_KEYS.length);
    // The pill has transition-all: without this the colours are read mid-fade from the light theme.
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
    await page.evaluate(
      (dark) => document.documentElement.classList.toggle('dark', dark),
      theme === 'dark',
    );

    for (const key of STATUS_KEYS) {
      const { text, fill } = await paintBadge(page, `Badge ${key}`);
      expect(
        contrast(text, fill),
        `${key} (${theme}): text ${text} on fill ${fill}`,
      ).toBeGreaterThanOrEqual(4.5);
      if (theme === 'dark') {
        // The light pastel fills are very bright; on the dark glass the pill must be a dark tint.
        expect(luminance(fill), `${key} dark fill ${fill} is still a light pastel`).toBeLessThan(
          0.2,
        );
      }
    }
  });
}
