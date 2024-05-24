import { Injectable, inject } from '@angular/core';
import { GREETING_CONFIG } from './greeting.config';

@Injectable()
export class GreetingService {
  private greetingConfig = inject(GREETING_CONFIG);

  getGreeting() {
    return this.greetingConfig.greetingMessage;
  }
}
