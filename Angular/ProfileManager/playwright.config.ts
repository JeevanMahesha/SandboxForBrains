import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for `ng e2e`.
 *
 * The Angular builder (`playwright-ng-schematics:playwright`) starts the dev server from the
 * `ProfileManager:serve:e2e` target and hands its address over via PLAYWRIGHT_TEST_BASE_URL.
 * That configuration swaps in `environment.e2e.ts`, so the browser only ever talks to the
 * local Firebase emulators started below, never to the real project.
 *
 * Run `pnpm emulators` + `pnpm start:e2e` manually and then `pnpm exec playwright test` to
 * iterate without restarting the servers each time.
 */
export default defineConfig({
  testDir: './e2e',
  // All tests share one emulator instance, so they must run one at a time.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  globalSetup: './e2e/support/global-setup.ts',
  use: {
    baseURL: process.env['PLAYWRIGHT_TEST_BASE_URL'] ?? 'http://127.0.0.1:4300',
    trace: 'on-first-retry',
  },
  projects: [
    {
      // Firestore security-rules tests: Node only, no browser.
      name: 'rules',
      testMatch: /rules\/.*\.spec\.ts$/,
    },
    {
      // 1280px wide, so the desktop table view is the one rendered.
      name: 'chromium',
      testIgnore: /rules\//,
      use: {
        ...devices['Desktop Chrome'],
        // Escape hatch for machines that cannot download Playwright's Chromium:
        // PLAYWRIGHT_BROWSER_CHANNEL=chrome uses the installed Google Chrome instead.
        ...(process.env['PLAYWRIGHT_BROWSER_CHANNEL']
          ? { channel: process.env['PLAYWRIGHT_BROWSER_CHANNEL'] }
          : {}),
      },
    },
  ],
  webServer: {
    // Resolved from node_modules/.bin, which `ng e2e`, `pnpm exec` and `npx` all put on PATH.
    // Deliberately not wrapped in `pnpm exec`: the wrapper detaches the emulator processes,
    // so Playwright could not terminate them and would hang on shutdown.
    command: 'firebase emulators:start --only auth,firestore --project demo-profilemanager',
    // Only one readiness URL is supported; global-setup.ts then waits for every emulator.
    url: 'http://127.0.0.1:8080/',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
    // firebase-tools starts the Java Firestore emulator detached, so a plain SIGKILL of the
    // CLI would orphan it and leave port 8080 busy. SIGTERM lets the CLI shut everything down.
    gracefulShutdown: { signal: 'SIGTERM', timeout: 15_000 },
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
