import type { FirebaseOptions } from 'firebase/app';

export interface Environment {
  production: boolean;
  /**
   * When true the app connects to the local Firebase emulators instead of the real project.
   * Only ever set this in `environment.e2e.ts`; `provideFirebase` refuses to enable it for a
   * project id that does not start with `demo-`.
   */
  useEmulators: boolean;
  firebase: FirebaseOptions;
}
