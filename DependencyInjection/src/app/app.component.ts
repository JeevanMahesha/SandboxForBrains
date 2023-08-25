import { Component, Optional, Self, SkipSelf } from '@angular/core';
import { LoggerService } from './logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'DependencyInjection';

  /*
  Parameter decorator marks dependency as optional

  if the dependency is not injected it will not throw null injector error no provider for service

   constructor(@Optional() private lg: LoggerService) {
    if (lg) {
      lg.log('LoggerService');
    }
  }
  */

  /*
The @Self decorator instructs Angular to look for the dependency only in the local injector. The local injector is the injector that is part of the current component or directive.
  constructor(@Self() private lg: LoggerService) {}
 */

  /*
@SkipSelf
The @SkipSelf decorator instructs Angular to look for the dependency in the Parent Injector and upwards.
  constructor(@SkipSelf() private lg: LoggerService) {}
 */
}
