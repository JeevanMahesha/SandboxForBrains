import { expect, test } from './support/fixtures';

// Playwright cannot emulate `prefers-reduced-transparency`, so this test takes the real rule out
// of the app's stylesheet and makes it apply unconditionally (`media.mediaText = 'all'`). The rule
// keeps its position in the cascade, so what is checked is exactly what the cascade does for a
// user who has the preference on, in each theme.
test.describe('reduced transparency', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`makes cards opaque and drops the blur in ${theme} mode`, async ({ page }) => {
      await page.goto('/login');

      const tokens = await page.evaluate((mode) => {
        // The page can carry more than one copy of the global stylesheet; force every copy, since
        // the last one is the one that wins.
        const rules = [...document.styleSheets]
          .flatMap((sheet) => [...sheet.cssRules])
          .filter(
            (r): r is CSSMediaRule =>
              r instanceof CSSMediaRule && r.conditionText.includes('prefers-reduced-transparency'),
          );
        if (!rules.length)
          throw new Error('no prefers-reduced-transparency rule in the stylesheet');
        rules.forEach((rule) => (rule.media.mediaText = 'all'));

        const root = document.documentElement;
        root.classList.toggle('dark', mode === 'dark');
        const read = (name: string) => getComputedStyle(root).getPropertyValue(name).trim();
        return { card: read('--card'), popover: read('--popover'), blur: read('--glass-blur') };
      }, theme);

      expect(tokens.popover).not.toBe('');
      expect(tokens.card, `--card should equal the opaque --popover in ${theme} mode`).toBe(
        tokens.popover,
      );
      expect(tokens.blur).toBe('0px');
    });
  }
});
