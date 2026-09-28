import type { Page } from '@playwright/test';
import { expect, test } from './support/fixtures';

// The theme toggle only exists in the toolbar (profiles list page), so every test logs in first.
// Its accessible name changes with the current preference ("Theme: system|light|dark"), so a
// regex-named locator is used to find the button regardless of state, while exact names assert
// a specific state.
const themeButton = (page: Page) => page.getByRole('button', { name: /^Theme:/ });

test.describe('theme toggle', () => {
  test('cycles system -> light -> dark -> system, toggling the .dark class on <html>', async ({
    page,
    loginAsAdmin,
  }) => {
    // Pins the OS-level scheme so the 'system' preference is deterministic (light, no .dark
    // class) instead of depending on whatever the test machine's actual color scheme is.
    await page.emulateMedia({ colorScheme: 'light' });
    await loginAsAdmin();

    const html = page.locator('html');

    // Fresh session, nothing in localStorage yet: defaults to 'system'.
    await expect(themeButton(page)).toHaveAttribute('aria-label', 'Theme: system');
    await expect(html).not.toHaveClass(/dark/);

    await themeButton(page).click();
    await expect(themeButton(page)).toHaveAttribute('aria-label', 'Theme: light');
    await expect(html).not.toHaveClass(/dark/);

    await themeButton(page).click();
    await expect(themeButton(page)).toHaveAttribute('aria-label', 'Theme: dark');
    await expect(html).toHaveClass(/dark/);

    await themeButton(page).click();
    await expect(themeButton(page)).toHaveAttribute('aria-label', 'Theme: system');
    await expect(html).not.toHaveClass(/dark/);
  });

  test('system preference follows the OS dark-scheme media query', async ({
    page,
    loginAsAdmin,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await loginAsAdmin();

    await expect(themeButton(page)).toHaveAttribute('aria-label', 'Theme: system');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('persists the chosen theme across a reload', async ({ page, loginAsAdmin }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await loginAsAdmin();

    await themeButton(page).click(); // system -> light
    await themeButton(page).click(); // light -> dark
    await expect(themeButton(page)).toHaveAttribute('aria-label', 'Theme: dark');
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Auth uses session persistence, which survives a reload of the same tab (unlike
    // Playwright's storageState across tests), so the profiles page renders again post-reload.
    await page.reload();

    await expect(themeButton(page)).toHaveAttribute('aria-label', 'Theme: dark');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
