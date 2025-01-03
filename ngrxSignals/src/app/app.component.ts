import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { WithOutRxJsComponent } from './with-out-rx-js/with-out-rx-js.component';
import { WithRxJsComponent } from './with-rx-js/with-rx-js.component';

@Component({
  selector: 'app-root',
  template: `
    <mat-tab-group>
      <mat-tab label="with Out RxJS">
        <app-with-out-rx-js />
      </mat-tab>
      <mat-tab label="with RxJS">
        <app-with-rx-js />
      </mat-tab>
    </mat-tab-group>
  `,
  imports: [MatTabsModule, WithOutRxJsComponent, WithRxJsComponent],
})
export class AppComponent {
  title = 'ngrxSignals';
}
