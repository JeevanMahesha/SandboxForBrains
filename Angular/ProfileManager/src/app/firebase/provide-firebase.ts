import { InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import {
  Auth,
  browserSessionPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence,
} from 'firebase/auth';
import { Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FirebaseApp');
export const FIREBASE_AUTH = new InjectionToken<Auth>('FirebaseAuth');
export const FIRESTORE = new InjectionToken<Firestore>('Firestore');

export interface FirebaseAppCheckConfig {
  recaptchaEnterpriseKey: string;
  /** `true` logs a debug token to the browser console; use a string for a registered CI token. */
  debugToken?: boolean | string;
}

export interface ProvideFirebaseConfig {
  firebase: FirebaseOptions;
  useFirebaseEmulators?: boolean;
  appCheck?: FirebaseAppCheckConfig;
}

function initAppCheckIfConfigured(
  app: FirebaseApp,
  appCheck: FirebaseAppCheckConfig | undefined,
): void {
  if (typeof window === 'undefined' || !appCheck?.recaptchaEnterpriseKey) {
    return;
  }
  const win = window as Window & { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string };
  if (appCheck.debugToken !== undefined) {
    win.FIREBASE_APPCHECK_DEBUG_TOKEN = appCheck.debugToken === true ? true : appCheck.debugToken;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheck.recaptchaEnterpriseKey),
    isTokenAutoRefreshEnabled: true,
  });
}

export function provideFirebase(config: ProvideFirebaseConfig) {
  const useEmulators = config.useFirebaseEmulators === true;

  return makeEnvironmentProviders([
    {
      provide: FIREBASE_APP,
      useFactory: () => {
        const app = initializeApp(config.firebase);
        initAppCheckIfConfigured(app, config.appCheck);
        return app;
      },
    },
    {
      provide: FIREBASE_AUTH,
      deps: [FIREBASE_APP],
      useFactory: (app: FirebaseApp) => {
        const auth = getAuth(app);
        if (useEmulators && typeof window !== 'undefined') {
          connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
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
        const firestore = getFirestore(app);
        if (useEmulators && typeof window !== 'undefined') {
          connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
        }
        return firestore;
      },
    },
  ]);
}
