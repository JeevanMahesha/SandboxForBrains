import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, mergeMap, of, take, tap } from 'rxjs';
import { DbAccess } from '../DB/DB.access';
import {
  IDeletedCount,
  MealsConsumed_Copy,
  mealConsumptionDetailsWithUser,
  mealDetailByWeekWise,
} from '../app.model';
import { DeleteRecordComponent } from '../delete-record/delete-record.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-all-meal-records',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './all-meal-records.component.html',
})
export class AllMealRecordsComponent {
  totalMealDetails$: Observable<mealDetailByWeekWise | null> = of(null);

  pageLoading = true;
  constructor(
    private _db: DbAccess,
    private dialog: MatDialog,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.totalMealDetails$ = this._db
      .getAllMealDetails_Copy()
      .pipe(
        map(this._db.getMealDetailByDayWise.bind(this._db)),
        map(this._db.getMealDetailByWeek.bind(this._db))
      );
  }

  deleteRecord(mealDetail: mealConsumptionDetailsWithUser): void {
    this.dialog
      .open(DeleteRecordComponent, { width: '400px', disableClose: true })
      .afterClosed()
      .pipe(
        take(1),
        mergeMap((deleteActionRes: keyof typeof MealsConsumed_Copy) => {
          return deleteActionRes === 'Yes'
            ? this._db.deleteOneRecord__Copy(mealDetail._id!)
            : of(null);
        })
      )
      .subscribe((res: IDeletedCount | null) => {
        if (res?.deletedCount) {
          this.toaster.success(
            `Record Deleted successfully.
                  ${mealDetail.mealDate} - ${mealDetail.day} - ${mealDetail.mealTime}`
          );
          this.totalMealDetails$ = this._db
            .getAllMealDetails_Copy()
            .pipe(
              map(this._db.getMealDetailByDayWise.bind(this._db)),
              map(this._db.getMealDetailByWeek.bind(this._db))
            );
        }
      });
  }
}
