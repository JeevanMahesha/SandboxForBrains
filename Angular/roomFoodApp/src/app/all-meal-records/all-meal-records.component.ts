import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, mergeMap, of, take, tap } from 'rxjs';
import { DbAccess } from '../DB/DB.access';
import {
  IDeletedCount,
  MealsConsumed,
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
  styles: `
  .accordion-collapse-hidden {
  max-height: 0;
  opacity: 0;
}

.accordion-collapse-visible {
  max-height: auto;
  opacity: 1;
}

.transition-max-height {
  transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
}
  `,
})
export class AllMealRecordsComponent {
  totalMealDetails$: Observable<mealDetailByWeekWise | null> = of(null);
  private openAccordions: {
    [key: number]: {
      isOpen: any;
      [key: number]: boolean;
    };
  } = {};
  constructor(
    private _db: DbAccess,
    private dialog: MatDialog,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.totalMealDetails$ = this._db
      .getAllMealDetails()
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
        mergeMap((deleteActionRes: keyof typeof MealsConsumed) => {
          return deleteActionRes === 'Yes'
            ? this._db.deleteOneRecord(mealDetail._id!)
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
            .getAllMealDetails()
            .pipe(
              map(this._db.getMealDetailByDayWise.bind(this._db)),
              map(this._db.getMealDetailByWeek.bind(this._db))
            );
        }
      });
  }

  toggleAccordion(weekIndex: number, mealIndex?: number): void {
    if (mealIndex !== undefined) {
      this.closeAllMealAccordions(weekIndex);
      this.openAccordions[weekIndex] = {
        ...this.openAccordions[weekIndex],
        [mealIndex]: !this.openAccordions[weekIndex][mealIndex],
      };
    } else {
      this.closeAllWeekAccordions();
      this.openAccordions[weekIndex] = {
        isOpen: !this.openAccordions[weekIndex]?.isOpen,
      };
    }
  }

  closeAllWeekAccordions(): void {
    this.openAccordions = {};
  }

  closeAllMealAccordions(weekIndex: number): void {
    if (this.openAccordions[weekIndex]) {
      this.openAccordions[weekIndex] = {
        isOpen: this.openAccordions[weekIndex].isOpen,
      };
    }
  }

  isAccordionOpen(weekIndex: number, mealIndex?: number): boolean {
    if (mealIndex !== undefined) {
      return this.openAccordions[weekIndex]?.[mealIndex] ?? false;
    }
    return this.openAccordions[weekIndex]?.isOpen ?? false;
  }
}
