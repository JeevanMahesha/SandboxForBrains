import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, map, of, tap } from 'rxjs';
import { DbAccess } from '../DB/DB.access';
import {
  ITotalMealAmountDetail,
  MealCost,
  MealTime,
  mealConsumptionDetailsWithUser,
} from '../app.model';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-detail-total',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatProgressSpinnerModule],
  templateUrl: './detail-total.component.html',
})
export class DetailTotalComponent implements OnInit {
  totalMealDetails$: Observable<ITotalMealAmountDetail[] | null> = of(null);
  totalAmount: number | null = 0;
  private _db = inject(DbAccess);

  ngOnInit(): void {
    this.totalMealDetails$ = this._db.getAllMealDetails().pipe(
      map(this._db.filterMealConsumedUserAndFlatValue.bind(this._db)),
      map(
        this._db.filterMealsConsumptionByKey.bind(this._db, 'mealsConsumedUser')
      ),
      map((mealDetail) => {
        return Object.entries(mealDetail).reduce(
          (pre, [userName, mealDetail]) => {
            const value = this._db.filterMealsConsumptionByKey(
              'mealTime',
              mealDetail
            );
            const totalMealTimeAmount = this.getTotalAmountForMealTime(value);

            pre[userName] = { ...totalMealTimeAmount };
            return pre;
          },
          {} as Record<string, Record<string, number>>
        );
      }),
      map((totalMealAmountDetailByUser) => {
        return Object.entries(totalMealAmountDetailByUser).map(
          ([key, value]) => {
            const totalMealAmount = Object.values(value).reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            );
            const dataValue = {
              ...value,
              mealsConsumedUser: key,
              totalMealAmount,
            };
            return dataValue;
          }
        );
      }),
      tap((mealDetail) => {
        this.totalAmount = mealDetail
          .map((each) => each.totalMealAmount)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      })
    );
  }

  private getTotalAmountForMealTime(
    mealDetail: Record<string, mealConsumptionDetailsWithUser[]>
  ): Record<string, number> {
    return Object.entries(mealDetail).reduce(
      (pre, [mealTime, mealsConsumedDetail]) => {
        switch (mealTime) {
          case MealTime.BreakFast:
          case MealTime.Dinner:
            pre[mealTime] = mealsConsumedDetail.length * MealCost.BreakFast;
            break;
          case MealTime.Lunch:
            pre[mealTime] = mealsConsumedDetail.length * MealCost.Dinner;
            break;
        }
        return pre;
      },
      {} as Record<string, number>
    );
  }
}
