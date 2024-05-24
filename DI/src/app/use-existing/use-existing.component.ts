import { Component, inject } from '@angular/core';
import { LoggerService } from './logger.service';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-use-existing',
  standalone: true,
  imports: [],
  template: `
    <h3>
      <strong>useExisting</strong> is a provider configuration in Angular used
      when you want to provide an existing instance of another injectable token.
      This allows you to provide one token that is an alias for another,
      enabling multiple tokens to be used interchangeably to inject the same
      instance.
    </h3>
  `,
  providers: [
    { provide: AnalyticsService, useExisting: LoggerService },
    LoggerService,
  ],
})
export default class UseExistingComponent {
  loggerService = inject(LoggerService);
  analyticsService = inject(AnalyticsService);

  constructor() {
    console.log(
      'LoggerService ⭄ AnalyticsService',
      this.loggerService === this.analyticsService
    );
  }
}
