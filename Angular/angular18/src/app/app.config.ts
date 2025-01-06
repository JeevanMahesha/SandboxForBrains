import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    // TODO: remove zoneJs from angular.json
    // provideExperimentalZonelessChangeDetection(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideAnimationsAsync(),
  ],
};
