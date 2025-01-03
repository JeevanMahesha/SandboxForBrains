import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { WithOutRxJsComponent } from './with-out-rx-js/with-out-rx-js.component';
import { WithRxJsComponent } from './with-rx-js/with-rx-js.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [MatTabsModule, WithOutRxJsComponent, WithRxJsComponent],
})
export class AppComponent {
  title = 'ngrxSignals';
}
