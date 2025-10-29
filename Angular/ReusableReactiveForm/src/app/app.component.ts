import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IAddressForm, IUserForm } from './app.form';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AddressComponent } from './address/address.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, AddressComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ReusableReactiveForm';
  userForm: FormGroup<IUserForm>;
  constructor() {
    this.userForm = new FormGroup({
      userName: new FormControl<string | null>(null),
      address: new FormArray<FormGroup<IAddressForm>>([]),
    });
  }

  get getFormAddressArray(): AbstractControl<FormGroup<IAddressForm>>[] {
    return (this.userForm.get('address') as FormArray).controls;
  }

  addNewAddress() {
    const dataValue = new FormGroup({
      country: new FormControl<string | null>('Jeevan'),
      state: new FormControl<string | null>('Jeevan'),
    });
    (this.userForm.get('address') as FormArray).push(dataValue);
  }

  submitForm() {
    console.log(this.userForm.value);
  }
}
