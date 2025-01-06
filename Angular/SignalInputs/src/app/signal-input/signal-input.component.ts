import { Component, effect, input } from '@angular/core';

@Component({
  selector: 'app-signal-input',
  standalone: true,
  imports: [],
  template: `
    <p>counter value {{ countValue() }}</p>
    <p>Double counter value {{ doubleCountValue() }}</p>
  `,
})
export class SignalInputComponent {
  countValue = input.required<number>();
  doubleCountValue = input.required({
    transform: (num: number): number => num * 2,
  });
}
