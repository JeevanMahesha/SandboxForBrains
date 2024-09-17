import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { fireBaseInitializeAppConfig } from '../environment/env.dev';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: fireBaseInitializeAppConfig.projectId,
        appId: fireBaseInitializeAppConfig.appId,
        storageBucket: fireBaseInitializeAppConfig.storageBucket,
        apiKey: fireBaseInitializeAppConfig.apiKey,
        authDomain: fireBaseInitializeAppConfig.authDomain,
        messagingSenderId: fireBaseInitializeAppConfig.messagingSenderId,
        measurementId: fireBaseInitializeAppConfig.measurementId,
      })
    ),
    provideAuth(() => getAuth()),
  ],
};
