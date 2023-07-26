import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { environmentValues } from 'src/environment/environment';
import { MealsConsumed, MealsConsumed_Copy } from '../app.model';

@Component({
  selector: 'app-delete-record',
  standalone: true,
  imports: [CommonModule, MatInputModule, ReactiveFormsModule],
  template: `
    <div class="text-center mt-2 mb-2">
      <mat-form-field>
        <mat-label>Password</mat-label>
        <input
          matInput
          placeholder="Password"
          [formControl]="password"
          type="password"
        />
      </mat-form-field>
      <br />
      <button class="btn btn-secondary" (click)="closeDialog('No')">
        Close
      </button>
      &nbsp;
      <button
        *ngIf="!password.invalid"
        (click)="closeDialog('Yes')"
        class="btn btn-danger"
      >
        Delete all records
      </button>
    </div>
  `,
})
export class DeleteRecordComponent {
  constructor(private dialogRef: MatDialogRef<DeleteRecordComponent>) {}

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

  closeDialog(closeType: keyof typeof MealsConsumed_Copy) {
    this.dialogRef.close(closeType);
  }
}
