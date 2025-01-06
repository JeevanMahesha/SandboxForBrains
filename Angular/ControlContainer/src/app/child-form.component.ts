import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ControlContainer } from '@angular/forms';
import { IAddress, IUser } from './app.component';

@Component({
  selector: 'app-child-form',
  standalone: true,
  template: `
    <div formGroupName="address">
      <div>
        <label for="street">Street:</label>
        <input id="street" formControlName="street" />
      </div>
      <br />
      <div>
        <label for="city">City:</label>
        <input id="city" formControlName="city" />
      </div>
      <br />
      <div>
        <label for="zip">Zip Code:</label>
        <input id="zip" formControlName="zip" />
      </div>
      <br />
    </div>
  `,
  imports: [ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class ChildFormComponent implements OnInit {
  constructor(private controlContainer: ControlContainer) {}

  get getParentFormGroupTemp(): AbstractControl<IAddress, IAddress> | null {
    return this.controlContainer.control;
  }

  get getParentFormGroup(): FormGroup<IUser> {
    return this.controlContainer.control as FormGroup<IUser>;
  }

  ngOnInit() {
    setTimeout(() => {
      console.log('i have added the control');
      this.getParentFormGroup.addControl(
        'lastName',
        new FormControl<string>('', Validators.required)
      );
    }, 2000);
  }
}
