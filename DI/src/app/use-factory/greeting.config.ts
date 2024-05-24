import { InjectionToken } from '@angular/core';
import { GreetingConfig } from './use-factory.modal';

export const GREETING_CONFIG = new InjectionToken<GreetingConfig>(
  'greeting.config'
);
