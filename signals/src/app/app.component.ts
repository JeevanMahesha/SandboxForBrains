import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  template: `
    <section class="p-5">
      <h1 class="text-center">Angular Signals</h1>
      <mat-tab-group>
        <mat-tab label="First"> Content 1 </mat-tab>
      </mat-tab-group>
    </section>
  `,
  standalone: true,
  imports: [MatTabsModule],
})
export class AppComponent {}
