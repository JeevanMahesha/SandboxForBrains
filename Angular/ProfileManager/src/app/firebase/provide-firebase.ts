import { InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import {
  Auth,
  browserSessionPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence,
} from 'firebase/auth';
import {
  Firestore,
  connectFirestoreEmulator,
  initializeFirestore,
  memoryLocalCache,
} from 'firebase/firestore';

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FirebaseApp');
export const FIREBASE_AUTH = new InjectionToken<Auth>('FirebaseAuth');
export const FIRESTORE = new InjectionToken<Firestore>('Firestore');

/** Local emulator endpoints. Must match the `emulators` block in firebase.json. */
export const EMULATOR_HOSTS = {
  auth: 'http://127.0.0.1:9099',
  firestore: { host: '127.0.0.1', port: 8080 },
} as const;

export interface ProvideFirebaseOptions {
  /** Connect Auth and Firestore to the local emulators instead of the real project. */
  useEmulators?: boolean;
}

export function provideFirebase(config: FirebaseOptions, options: ProvideFirebaseOptions = {}) {
  const useEmulators = options.useEmulators ?? false;

  // Emulator mode is only ever allowed against a `demo-` project id. This guarantees that a
  // misconfigured environment can never point the emulator wiring at production data.
  if (useEmulators && !config.projectId?.startsWith('demo-')) {
    throw new Error(
      `provideFirebase: useEmulators requires a "demo-" projectId, got "${config.projectId}".`,
    );
  }

  // The reverse also holds: a `demo-` id is not a real project, so without the emulators it would
  // quietly talk to a backend that does not exist. Fail at startup instead.
  if (!useEmulators && config.projectId?.startsWith('demo-')) {
    throw new Error(
      `provideFirebase: the "demo-" projectId "${config.projectId}" requires useEmulators.`,
    );
  }

  return makeEnvironmentProviders([
    {
      provide: FIREBASE_APP,
      useFactory: () => initializeApp(config),
    },
    {
      provide: FIREBASE_AUTH,
      deps: [FIREBASE_APP],
      useFactory: (app: FirebaseApp) => {
        const auth = getAuth(app);
        if (useEmulators) {
          connectAuthEmulator(auth, EMULATOR_HOSTS.auth, { disableWarnings: true });
        }
        setPersistence(auth, browserSessionPersistence).catch((error) => {
          console.error('Error setting auth persistence:', error);
        });
        return auth;
      },
    },
    {
      provide: FIRESTORE,
      deps: [FIREBASE_APP],
      useFactory: (app: FirebaseApp) => {
        // In-memory cache only, for the real project and the emulators alike. A persistent
        // (IndexedDB) cache would keep every profile it read on disk after logout and tab close,
        // while the auth session ends with the tab. The app issues one-shot reads, so the cache
        // buys little; it also keeps e2e runs on the same cache the production build uses.
        const firestore = initializeFirestore(app, { localCache: memoryLocalCache() });
        if (useEmulators) {
          connectFirestoreEmulator(
            firestore,
            EMULATOR_HOSTS.firestore.host,
            EMULATOR_HOSTS.firestore.port,
          );
        }
        return firestore;
      },
    },
  ]);
}
