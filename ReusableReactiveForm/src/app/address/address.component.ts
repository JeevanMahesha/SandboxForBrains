import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { IAddressForm, IUserForm } from '../app.form';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent {
  @Input({ required: true }) indexValue: number | null = null;
  private readonly parentControl = inject(ControlContainer);

  get getParentFormControl(): FormGroup<IUserForm> {
    return this.parentControl.control as FormGroup;
  }

  get getAddressFormControl(): AbstractControl<FormGroup<IAddressForm>>[] {
    return (this.getParentFormControl.get('address') as FormArray)?.controls;
  }
}
