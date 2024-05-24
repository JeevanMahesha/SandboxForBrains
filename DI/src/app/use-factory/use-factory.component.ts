import { Component, inject } from '@angular/core';
import { GREETING_CONFIG } from './greeting.config';
import { greetingConfigFactory } from './use-factory.functions';
import { GreetingService } from './greeting.service';

@Component({
  selector: 'app-use-factory',
  standalone: true,
  template: `
    <h3>
      A factory provider in Angular is a way to create something (like a service
      or a configuration object) using a special function. This function can do
      some work to decide how to create that thing. It’s like a recipe that
      tells Angular how to bake a cake, but the recipe can change based on what
      ingredients (dependencies) are available.
    </h3>
  `,
  providers: [
    { provide: GREETING_CONFIG, useFactory: greetingConfigFactory },
    GreetingService,
  ],
})
export default class UseFactoryComponent {
  greetingService = inject(GreetingService);
  constructor() {
    console.log('useFactory ->', this.greetingService.getGreeting());
  }
}
