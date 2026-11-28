import { makeProfile, seedProfiles } from './support/emulator';
import { expect, test } from './support/fixtures';

const FONT_HOSTS = /fonts\.(googleapis|gstatic)\.com/;

test.describe('no external font requests', () => {
  test('the page ships no Google Fonts stylesheet and never calls the font hosts', async ({
    page,
    loginAsAdmin,
  }) => {
    const requested: string[] = [];
    page.on('request', (request) => requested.push(request.url()));

    await seedProfiles([makeProfile(0)]);
    await page.goto('/login');
    await expect(page.locator('#login-email')).toBeVisible();
    await loginAsAdmin();
    await expect(page.getByTestId('profile-card')).toHaveCount(1);
    // Any web font that was going to load has been requested once this resolves.
    await page.evaluate(() => document.fonts.ready);

    expect(requested.filter((url) => FONT_HOSTS.test(url))).toEqual([]);

    // Not just "nothing was fetched": no link and no @font-face may point at a font host either
    // (the production build inlines such a link's CSS into index.html at build time).
    const references = await page.evaluate((hostPattern) => {
      const pattern = new RegExp(hostPattern);
      const links = [...document.querySelectorAll('link[href]')]
        .map((link) => link.getAttribute('href') ?? '')
        .filter((href) => pattern.test(href));
      const rules: string[] = [];
      for (const sheet of Array.from(document.styleSheets)) {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule instanceof CSSFontFaceRule && pattern.test(rule.cssText)) {
            rules.push(rule.cssText.slice(0, 80));
          }
        }
      }
      return { links, rules };
    }, FONT_HOSTS.source);
    expect(references).toEqual({ links: [], rules: [] });
  });
});
