import { expect, test } from '@playwright/test';

/**
 * Weight of the code a signed-out visitor downloads on `/login`, as decoded JavaScript bytes (so
 * the server's compression does not matter). The app only does one-shot reads and writes, so it
 * uses Firestore Lite; the full SDK adds about 420 kB of Firestore plus 185 kB of re2js to the
 * production bundle.
 *
 * The e2e dev server serves the app unminified-ish, so the absolute numbers are larger than the
 * production build. Measured here: about 6.5 MB with the full SDK, about 4.5 MB with Lite. The
 * limit sits between the two, so going back to the full SDK fails this test.
 */
const LOGIN_JS_LIMIT_BYTES = 5_500_000;

test.describe('bundle weight', () => {
  test('/login downloads a lean amount of JavaScript', async ({ page }) => {
    let jsBytes = 0;
    page.on('response', async (response) => {
      if (new URL(response.url()).pathname.endsWith('.js')) {
        jsBytes += (await response.body()).length;
      }
    });

    await page.goto('/login');
    await expect(page.locator('#login-email')).toBeVisible();
    await page.waitForLoadState('networkidle');

    expect(jsBytes).toBeLessThan(LOGIN_JS_LIMIT_BYTES);
  });
});
