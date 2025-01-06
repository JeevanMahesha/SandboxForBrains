import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-decorator-input',
  standalone: true,
  imports: [],
  template: `
    <p>counter value {{ countValue }}</p>
    <p>Double counter value {{ doubleCountValue }}</p>
  `,
})
export class DecoratorInputComponent {
  @Input({ required: true }) countValue = 0;
  @Input({ required: true, transform: (num: number): number => num * 2 })
  doubleCountValue = 0;
}
