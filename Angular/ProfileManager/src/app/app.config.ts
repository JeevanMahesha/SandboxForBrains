import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { AppErrorHandler } from './error-handler';
import { provideFirebase } from './firebase/provide-firebase';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideFirebase(environment.firebase, { useEmulators: environment.useEmulators }),
  ],
};
