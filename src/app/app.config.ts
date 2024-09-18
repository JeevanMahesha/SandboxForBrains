import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { fireBaseInitializeAppConfig } from '../environment/env.dev';
import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

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
        databaseURL: fireBaseInitializeAppConfig.databaseURL,
      })
    ),
    AngularFireDatabaseModule,
    provideAuth(() => getAuth()), provideAnimationsAsync(),
  ],
};
