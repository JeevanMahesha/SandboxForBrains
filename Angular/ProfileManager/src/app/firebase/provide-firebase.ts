import { InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { Auth, browserSessionPersistence, getAuth, setPersistence } from 'firebase/auth';
import {
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from 'firebase/firestore';

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FirebaseApp');
export const FIREBASE_AUTH = new InjectionToken<Auth>('FirebaseAuth');
export const FIRESTORE = new InjectionToken<Firestore>('Firestore');

export function provideFirebase(config: FirebaseOptions) {
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
        setPersistence(auth, browserSessionPersistence).catch((error) => {
          console.error('Error setting auth persistence:', error);
        });
        return auth;
      },
    },
    {
      provide: FIRESTORE,
      deps: [FIREBASE_APP],
      // persistentSingleTabManager pairs well with browserSessionPersistence:
      // each tab owns its own session, and IndexedDB cache speeds up repeat reads
      // within that same tab without leaking data across tabs.
      useFactory: (app: FirebaseApp) =>
        initializeFirestore(app, {
          localCache: persistentLocalCache({ tabManager: persistentSingleTabManager(undefined) }),
        }),
    },
  ]);
}
