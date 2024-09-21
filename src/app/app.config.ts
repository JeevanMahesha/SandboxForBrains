import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { fireBaseInitializeAppConfig } from '../environment/env.dev';
import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { DBService } from './db/db.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: fireBaseInitializeAppConfig },
    AuthService,
    DBService,
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
    provideFirestore(() => getFirestore()),
    provideAnimationsAsync(),
  ],
};
