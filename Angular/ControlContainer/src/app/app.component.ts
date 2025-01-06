import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChildFormComponent } from './child-form.component';

@Component({
  selector: 'app-root',
  template: `
    <form [formGroup]="parentForm">
      <div>
        <label for="name">Name:</label>
        <input id="name" formControlName="name" />
      </div>
      <br />
      @if (parentForm.controls.lastName) {

      <div>
        <label for="lastName">lastName:</label>
        <input id="lastName" formControlName="lastName" />
      </div>
      }
      <br />
      <app-child-form></app-child-form>

      <button [disabled]="parentForm.invalid" (click)="onSubmit()">
        Submit
      </button>
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, ChildFormComponent],
})
export class AppComponent {
  parentForm: FormGroup<IUser>;

  constructor(private fb: FormBuilder) {
    this.parentForm = this.fb.group({
      name: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        zip: [''],
      }),
    });
    setTimeout(() => {
      this.parentForm.controls.lastName?.valueChanges.subscribe((value) => {
        if (value === 'asd') {
          this.parentForm.controls.name.addValidators(Validators.required);
          this.parentForm.controls.name.updateValueAndValidity();
        }
      });
    }, 5000);
  }

  onSubmit() {
    console.log(this.parentForm.value);
  }
}

export interface IUser {
  name: FormControl<string | null>;
  address: FormGroup<IAddress>;
  lastName?: FormControl<string | null>;
}

export interface IAddress {
  street: FormControl<string | null>;
  city: FormControl<string | null>;
  zip: FormControl<string | null>;
}
