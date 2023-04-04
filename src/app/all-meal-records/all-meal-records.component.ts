import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DbAccess } from '../DB/DB.access';
import { ITotal, MealsConsumed } from '../app.model';
import { DeleteRecordComponent } from '../delete-record/delete-record.component';
import { HeaderComponent } from '../header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { take } from 'rxjs';
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
  providers: [DbAccess],
  templateUrl: './all-meal-records.component.html',
})
export class AllMealRecordsComponent {
  totalMealDetails: ITotal[] = [];
  pageLoading = true;
  constructor(
    private _db: DbAccess,
    private dialog: MatDialog,
    private toaster: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getAllData();
  }

  deleteRecord(mealDetail: ITotal): void {
    this.dialog
      .open(DeleteRecordComponent, { width: '400px' })
      .afterClosed()
      .pipe(take(1))
      .subscribe((res: `${MealsConsumed}`) => {
        if (res === MealsConsumed.Yes) {
          this._db.deleteOneRecord(mealDetail._id!).then((res) => {
            if (res.result.deletedCount) {
              this.toaster.success(
                `Record Deleted successfully. Date  ${mealDetail.mealDate}, meal time ${mealDetail.mealTime}, meal day
                ${mealDetail.day}`
              );
              this.getAllData();
            } else {
              console.log(res);
            }
          });
        }
      });
  }

  private async getAllData(): Promise<void> {
    const allData = await this._db.getAllRecords();
    this.totalMealDetails = this._db
      .restructureTheData(allData.result)
      .sort((a, b) => a.todayDate?.getUTCDate()! - b.todayDate?.getUTCDate()!);
    this.pageLoading = false;
  }
}
