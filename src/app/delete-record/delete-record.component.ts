import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environmentValues } from 'src/environment/environment';

@Component({
  selector: 'app-delete-record',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatInputModule, ReactiveFormsModule],
  templateUrl: './delete-record.component.html',
})
export class DeleteRecordComponent {
  password = new FormControl(null, [
    Validators.required,
    this.validatorForPassword,
  ]);

  validatorForPassword(
    controlName: AbstractControl
  ): { error: boolean } | null {
    const passwordValue = controlName.value;
    return passwordValue === environmentValues.PASSWORD
      ? null
      : { error: true };
  }
}
