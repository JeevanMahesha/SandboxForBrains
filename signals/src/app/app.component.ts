import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SignalComponent } from './signal.component';
import { ComputedSignalComponent } from './computed-signal.component';
import { ToSignalComponent } from './rxjs-interop/to-signal.component';
import { RxjsInteropComponent } from './rxjs-interop/rxjs-interop.component';

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
        <mat-tab label="Computed signal">
          @defer (on viewport) {
          <app-computed-signal />
          } @placeholder (minimum 500ms) {
          <h6>Loading the Computed signal Component</h6>
          }
        </mat-tab>
        <mat-tab label="Rxjs Interop">
          @defer (on viewport) {
          <app-rxjs-interop />
          } @placeholder (minimum 500ms) {
          <h6>Loading the Rxjs Interop Component</h6>
          }
        </mat-tab>
      </mat-tab-group>
    </section>
  `,
  standalone: true,
  imports: [
    MatTabsModule,
    SignalComponent,
    ComputedSignalComponent,
    RxjsInteropComponent,
  ],
})
export class AppComponent {}
