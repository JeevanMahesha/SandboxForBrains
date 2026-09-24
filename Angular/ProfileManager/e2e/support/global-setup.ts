import { PROJECT_ID, clearAuth, createAdminUser, waitForEmulators } from './emulator';

/** Runs once before the whole suite: fresh Auth emulator with a single admin account. */
export default async function globalSetup(): Promise<void> {
  if (!PROJECT_ID.startsWith('demo-')) {
    throw new Error(`Refusing to run e2e against non-demo project "${PROJECT_ID}".`);
  }
  await waitForEmulators();
  await clearAuth();
  await createAdminUser();
}
