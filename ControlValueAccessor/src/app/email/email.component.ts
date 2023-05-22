import { Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmailComponent),
      multi: true,
    },
  ],
})
export class EmailComponent implements ControlValueAccessor {
  propagateChange: any = () => {};
  onTouch: any = () => {};
  emailValue = new FormControl<string | null>(null);

  writeValue(writeValue: string): void {
    this.emailValue.setValue(writeValue);
  }
  registerOnChange(fn: any): void {
    this.emailValue.valueChanges.subscribe(fn);
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
}
