import { expect, test } from './support/fixtures';

test.describe('Add Profile button glow', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the phone floating button keeps the brand glow next to its elevation', async ({
    page,
    loginAsAdmin,
  }) => {
    await loginAsAdmin();
    const fab = page.locator('[data-add-fab]');
    await expect(fab).toBeVisible();

    // The brand colour as the browser resolves it, so the check follows the theme token.
    const brand = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.color = 'var(--primary)';
      document.body.appendChild(probe);
      const colour = getComputedStyle(probe).color;
      probe.remove();
      return colour;
    });
    const shadow = await fab.evaluate((el) => getComputedStyle(el).boxShadow);

    expect(shadow, 'the FAB shadow includes a layer in the brand colour').toContain(brand);
    // And it still has a neutral elevation layer besides the glow.
    expect(shadow.split(/,(?![^(]*\))/).length).toBeGreaterThan(1);
  });
});
