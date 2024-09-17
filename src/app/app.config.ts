import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { fireBaseInitializeAppConfig } from '../environment/env.dev';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AuthService } from './auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: fireBaseInitializeAppConfig },
    AuthService,
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
