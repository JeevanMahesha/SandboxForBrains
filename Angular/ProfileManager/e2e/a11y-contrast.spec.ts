import type { Page } from '@playwright/test';
import { expect, test } from './support/fixtures';

// WCAG 1.4.11 (non-text contrast, 3:1) for a form control's boundary and its focus indicator, and
// 1.4.3 (text contrast, 4.5:1) for error text on the bare page background. Colours are read from
// the real computed styles and composited in the browser (a 1x1 canvas), so translucent tokens
// are measured as they are actually drawn, over the surfaces they sit on. The decorative aurora
// backdrop behind the glass surfaces is not modelled.

type Rgb = [number, number, number];

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

/** The element's border colour and the opaque surface behind it, both as drawn. */
async function paint(page: Page, selector: string): Promise<{ border: Rgb; surface: Rgb }> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel)!;
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
    ctx.canvas.width = ctx.canvas.height = 1;
    const fill = (color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
    };
    const pixel = () => Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)) as Rgb;

    fill('#ffffff');
    const ancestors: Element[] = [];
    for (let node = el.parentElement; node; node = node.parentElement) ancestors.unshift(node);
    for (const node of ancestors) fill(getComputedStyle(node).backgroundColor);
    const surface = pixel();

    const style = getComputedStyle(el);
    fill(style.backgroundColor); // the control's own fill sits under its border (dark inputs)
    fill(style.borderTopColor);
    return { border: pixel(), surface };
  }, selector);
}

async function openLogin(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/login');
  await expect(page.locator('#login-email')).toBeVisible();
  await page.evaluate(
    (dark) => document.documentElement.classList.toggle('dark', dark),
    theme === 'dark',
  );
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`contrast (${theme})`, () => {
    test('a form control border is at least 3:1 against its surface', async ({ page }) => {
      await openLogin(page, theme);
      const { border, surface } = await paint(page, '#login-email');
      expect(contrast(border, surface), `border ${border} on ${surface}`).toBeGreaterThanOrEqual(3);
    });

    test('the focused control border is at least 3:1 against its surface', async ({ page }) => {
      await openLogin(page, theme);
      await page.locator('#login-email').focus();
      await expect
        .poll(async () => {
          const { border, surface } = await paint(page, '#login-email');
          return contrast(border, surface);
        })
        .toBeGreaterThanOrEqual(3);
    });

    test('error text is at least 4.5:1 on the bare page background', async ({ page }) => {
      await openLogin(page, theme);
      await page.evaluate(() => {
        document.body.insertAdjacentHTML(
          'beforeend',
          '<p id="contrast-probe" class="text-destructive">Error text</p>',
        );
      });
      const probe = await page.evaluate(() => {
        const el = document.getElementById('contrast-probe')!;
        const ctx = document
          .createElement('canvas')
          .getContext('2d', { willReadFrequently: true })!;
        ctx.canvas.width = ctx.canvas.height = 1;
        const read = (color: string): number[] => {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, 1, 1);
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, 1, 1);
          return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
        };
        return {
          text: read(getComputedStyle(el).color),
          background: read(getComputedStyle(document.body).backgroundColor),
        };
      });
      expect(
        contrast(probe.text as Rgb, probe.background as Rgb),
        `text ${probe.text} on ${probe.background}`,
      ).toBeGreaterThanOrEqual(4.5);
    });
  });
}
