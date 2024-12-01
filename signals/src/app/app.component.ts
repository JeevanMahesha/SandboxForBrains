import { Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { ComputedSignalComponent } from './computed-signal.component';
import { LinkedSignalComponent } from './linked-signal/linked-signal.component';
import { ModelInputsComponent } from './model-inputs/model-inputs.component';
import { RxjsInteropComponent } from './rxjs-interop/rxjs-interop.component';
import { SignalComponent } from './signal.component';
import { ResourceComponent } from './resource/resource.component';

@Component({
  selector: 'app-root',
  template: `
    <section class="p-5">
      <h1 class="text-center">Angular Signals</h1>
      <mat-tab-group [(selectedIndex)]="selectedTabIndex">
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
        <mat-tab label="LinkedSignal">
          @defer (on viewport) {
          <app-linked-signal />
          } @placeholder (minimum 500ms) {
          <h6>Loading the Linked Signal</h6>
          }
        </mat-tab>
        <mat-tab label="Resource">
          @defer (on viewport) {
          <app-resource />
          } @placeholder (minimum 500ms) {
          <h6>Loading the Resource Component</h6>
          }
        </mat-tab>
        <mat-tab label="Rxjs Interop">
          @defer (on viewport) {
          <app-rxjs-interop />
          } @placeholder (minimum 500ms) {
          <h6>Loading the Rxjs Interop Component</h6>
          }
        </mat-tab>
        <mat-tab label="Model Inputs">
          @defer (on viewport) {
          <app-model-inputs />
          } @placeholder (minimum 500ms) {
          <h6>Loading the Model Inputs Component</h6>
          }
        </mat-tab>
      </mat-tab-group>
    </section>
  `,
  imports: [
    MatTabsModule,
    SignalComponent,
    ComputedSignalComponent,
    RxjsInteropComponent,
    ModelInputsComponent,
    LinkedSignalComponent,
    ResourceComponent,
  ],
})
export class AppComponent {
  selectedTabIndex = signal(0);
  constructor() {
    if (sessionStorage.getItem('selectedTabIndex')) {
      this.selectedTabIndex.set(
        parseInt(sessionStorage.getItem('selectedTabIndex')!)
      );
    }
    toObservable(this.selectedTabIndex).subscribe((indexValue) => {
      sessionStorage.setItem('selectedTabIndex', indexValue.toString());
    });
  }
}
