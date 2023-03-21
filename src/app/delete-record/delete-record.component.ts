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
import { DbAccess } from '../DB/DB.access';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-delete-record',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatInputModule,
    ReactiveFormsModule,
    ToastrModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <app-header></app-header>
    <mat-spinner class="spinner" *ngIf="pageLoading"></mat-spinner>

    <div class="container-fluid text-center mt-5" *ngIf="!pageLoading">
      <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
          <mat-form-field>
            <mat-label>Password</mat-label>
            <input
              matInput
              placeholder="Password"
              [formControl]="password"
              type="text"
            />
          </mat-form-field>
          <br />
          <button
            [disabled]="password.invalid"
            (click)="deleteAllRecords()"
            class="btn btn-danger"
          >
            Delete all records
          </button>
        </div>
        <div class="col-md-4"></div>
      </div>
    </div>
  `,
  providers: [DbAccess],
})
export class DeleteRecordComponent {
  pageLoading = false;
  constructor(private _db: DbAccess, private toaster: ToastrService) {}

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

  async deleteAllRecords(): Promise<void> {
    this.pageLoading = true;
    const allData = await this._db.getAllRecords();
    if (!allData.result.length) {
      this.toaster.info('No Records to Delete');
      this.pageLoading = false;
      return;
    }
    this._db
      .deleteAllRecords()
      .then((res) => {
        if (res.result.deletedCount) {
          this.toaster.success(
            `${res.result.deletedCount} records are Deleted Successfully`
          );
          this.pageLoading = false;
        }
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          this.toaster.error('Somthing went Wrong');
        }
      });
  }
}
