import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DbAccess } from '../DB/DB.access';
import { MealsConsumed, mealDetailByWeekWise } from '../app.model';
import { DeleteRecordComponent } from '../delete-record/delete-record.component';
import { HeaderComponent } from '../header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, map, of, take, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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

  deleteRecord(mealDetail: any): void {
    // this.dialog
    //   .open(DeleteRecordComponent, { width: '400px', disableClose: true })
    //   .afterClosed()
    //   .pipe(take(1))
    //   .subscribe((res: `${MealsConsumed}`) => {
    //     if (res === MealsConsumed.Yes) {
    //       this._db.deleteOneRecord(mealDetail._id!).then((res) => {
    //         if (res.result.deletedCount) {
    //           this.toaster.success(
    //             `Record Deleted successfully.
    //             ${mealDetail.mealDate} - ${mealDetail.day} - ${mealDetail.mealTime}`
    //           );
    //           // this.getAllData();
    //         } else {
    //           console.log(res);
    //         }
    //       });
    //     }
    //   });
  }
}
