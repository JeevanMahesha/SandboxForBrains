import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrimWhitespace]',
  standalone: true,
})
export class TrimWhitespaceDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const trimmedValue = value.trim();
    this.ngControl.control!.setValue(trimmedValue, { emitEvent: false });
  }
}
