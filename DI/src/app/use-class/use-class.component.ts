import { Component, inject } from '@angular/core';
import { LoggerService } from './logger.service';
import { BetterLoggerService } from './better-logger.service';

@Component({
  selector: 'app-use-class',
  standalone: true,
  providers: [{ provide: LoggerService, useClass: BetterLoggerService }],
  template: `<h3>
    The <strong>useClass</strong>
    provider key lets you create and return a new instance of the specified
    class.
  </h3> `,
})
export default class UseClassComponent {
  logger = inject(LoggerService);
}
