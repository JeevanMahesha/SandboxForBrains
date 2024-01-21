import { Component } from '@angular/core';
import { DecoratorInputComponent } from './decorator-input/decorator-input.component';
import { SignalInputComponent } from './signal-input/signal-input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DecoratorInputComponent, SignalInputComponent],
  template: `
    <div>
      <app-decorator-input
        [countValue]="initialCountValue"
        [doubleCountValue]="initialCountValue"
      ></app-decorator-input>
      <app-signal-input
        [countValue]="initialCountValue"
        [doubleCountValue]="initialCountValue"
      ></app-signal-input>
      <button type="button" (click)="increaseCount()">Increase Count</button>
    </div>
  `,
})
export class AppComponent {
  initialCountValue = 0;
  increaseCount(): void {
    this.initialCountValue++;
  }
}
