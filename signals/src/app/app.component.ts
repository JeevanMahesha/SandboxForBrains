import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SignalComponent } from './signal/signal.component';

@Component({
  selector: 'app-root',
  template: `
    <section class="p-5">
      <h1 class="text-center">Angular Signals</h1>
      <mat-tab-group>
        <mat-tab label="Signal">
          @defer (on viewport) {
          <app-signal />
          } @placeholder (minimum 500ms) {
          <h6>Loading the Signal Component</h6>
          }
        </mat-tab>
      </mat-tab-group>
    </section>
  `,
  standalone: true,
  imports: [MatTabsModule, SignalComponent],
})
export class AppComponent {}
