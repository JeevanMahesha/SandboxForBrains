import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbAccess } from '../DB/DB.access';
import { Observable, map, of, tap } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import {
  IMealAmountDetail,
  IReport,
  MealCost,
  MealTime,
  mealConsumptionDetailsWithUser,
  mealDetailByWeekWise,
  weekDays,
} from '../app.model';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './report.component.html',
})
export default class ReportComponent implements OnInit {
  report$: Observable<IReport[] | null> = of(null);
  totalMealConsumedCount: IMealAmountDetail = {
    BreakFast: 0,
    Lunch: 0,
    Dinner: 0,
  };
  totalMealTimeAmount: IMealAmountDetail = {
    BreakFast: 0,
    Lunch: 0,
    Dinner: 0,
  };
  totalAmount = 0;
  private _db = inject(DbAccess);

  ngOnInit(): void {
    this.report$ = this._db.getAllMealDetails().pipe(
      map(this._db.getMealDetailByDayWise.bind(this._db)),
      map(this._db.getMealDetailByWeek.bind(this._db)),
      map(this.restructureMealDetail.bind(this)),
      tap((reportDetail) => {
        this.totalMealConsumedCount = {
          BreakFast: this.getGrantTotalForMealTime(reportDetail, 'BreakFast'),
          Lunch: this.getGrantTotalForMealTime(reportDetail, 'Lunch'),
          Dinner: this.getGrantTotalForMealTime(reportDetail, 'Dinner'),
        };
        this.totalMealTimeAmount = {
          BreakFast: this.totalMealConsumedCount.BreakFast * MealCost.BreakFast,
          Lunch: this.totalMealConsumedCount.Lunch * MealCost.Lunch,
          Dinner: this.totalMealConsumedCount.Dinner * MealCost.Dinner,
        };
        this.totalAmount =
          this.totalMealTimeAmount.BreakFast +
          this.totalMealTimeAmount.Dinner +
          this.totalMealTimeAmount.Lunch;
      })
    );
  }

  private restructureMealDetail(
    mealDetailResp: mealDetailByWeekWise
  ): IReport[] {
    return Object.entries(mealDetailResp).reduce(
      (pre, [weekDayValue, mealDetailValue]) => {
        const day = weekDayValue as keyof typeof weekDays;
        const mealTimeAndTotalCount = this.getMealTimeAndTotalCount(
          mealDetailValue
        ).reduce((result, currentObj) => {
          return { ...result, ...currentObj };
        }, {});

        pre.push({
          BreakFast: 0,
          Dinner: 0,
          Lunch: 0,
          day,
          ...mealTimeAndTotalCount,
        });
        return pre;
      },
      [] as IReport[]
    );
  }

  private getMealTimeAndTotalCount(
    mealDetailValue: Record<string, mealConsumptionDetailsWithUser[]>
  ): Omit<IReport, 'day'>[] {
    return Object.entries(mealDetailValue).reduce(
      (pre, [mealTimeValue, mealDetail]) => {
        const mealTime = mealTimeValue as keyof typeof MealTime;
        const dataValue: any = {};
        dataValue[mealTime] = mealDetail.length;
        pre.push({
          ...dataValue,
        });
        return pre;
      },
      [] as Omit<IReport, 'day'>[]
    );
  }
  private getGrantTotalForMealTime(
    reportDetail: IReport[],
    property: keyof typeof MealTime
  ): number {
    return reportDetail.reduce((sum, obj) => sum + obj[property], 0);
  }
}
