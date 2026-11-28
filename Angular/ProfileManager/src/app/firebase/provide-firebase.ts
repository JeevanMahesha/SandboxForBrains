import { ErrorHandler, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import {
  Auth,
  browserSessionPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence,
} from 'firebase/auth';
import { Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore/lite';

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
      deps: [FIREBASE_APP, ErrorHandler],
      useFactory: (app: FirebaseApp, errorHandler: ErrorHandler) => {
        const auth = getAuth(app);
        if (useEmulators) {
          connectAuthEmulator(auth, EMULATOR_HOSTS.auth, { disableWarnings: true });
        }
        setPersistence(auth, browserSessionPersistence).catch((error) => {
          errorHandler.handleError(error);
        });
        return auth;
      },
    },
    {
      provide: FIRESTORE,
      deps: [FIREBASE_APP],
      useFactory: (app: FirebaseApp) => {
        // Firestore Lite: the app only issues one-shot reads and writes, never listeners, and Lite
        // keeps no cache at all, so no profile is ever stored in the browser. It is also a
        // fraction of the size of the full SDK.
        const firestore = getFirestore(app);
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
