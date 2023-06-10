import { Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { valueChangeType } from './email.model';

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
  email: string | null = null;
  disabled = false;
  private onChange: valueChangeType;
  private onTouched: valueChangeType;

  constructor() {
    this.onChange = () => {};
    this.onTouched = () => {};
  }
  /*
This will get the initial value from ngModel or formControl
*/
  writeValue(obj: string): void {
    this.email = obj;
  }

  /*
  This will update the value when it change
  */
  registerOnChange(fn: valueChangeType): void {
    this.onChange = fn;
  }

  /*
  This will update (touch property) the fromControl when it touch
  */
  registerOnTouched(fn: valueChangeType): void {
    this.onTouched = fn;
  }

  /*
  This will update disable state
  */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /*
When every value change we have to call the onChange and onTouched method then only formControl will
update it state
*/
  valueChangeEvent() {
    this.onChange(this.email as string);
    this.onTouched(null);
  }
}
