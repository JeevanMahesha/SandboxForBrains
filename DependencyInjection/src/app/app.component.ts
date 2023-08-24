import { Component, Optional } from '@angular/core';
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
}
