import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { App, Credentials, User } from 'realm-web';
import { Observable, from, map, mergeMap, of } from 'rxjs';
import { environmentValues } from 'src/environment/environment';
import {
  IDeletedCount,
  IInsertDetail,
  IMeal,
  IMealsConsumptionDetail,
  mealConsumptionDetailsWithUser,
  mealDetailByDayWise,
  mealDetailByWeekWise,
  weekDays,
} from '../app.model';

@Injectable({ providedIn: 'root' })
export class DbAccess {
  userDetail: User<
    Realm.DefaultFunctionsFactory,
    SimpleObject,
    Realm.DefaultUserProfileData
  > | null = null;
  constructor(private toaster: ToastrService, private router: Router) {
    if (!this.userDetail) {
      this.router.navigate(['meal-form']);
    }
  }

  getCredentials(): void {
    const app = new App({ id: environmentValues.REALM_APP_ID });
    const credentials = Credentials.apiKey(environmentValues.REALM_API_KEY);
    app
      .logIn(credentials)
      .then((userResponse) => (this.userDetail = userResponse));
  }

  getAllMealDetails(): Observable<IMealsConsumptionDetail[]> {
    return from(
      this.userDetail?.functions.callFunction('getAllMealDetails')!
    ).pipe(map((response) => response.result));
  }

  deleteOneRecord(_id: string): Observable<IDeletedCount> {
    return from(
      this.userDetail?.functions.callFunction('deleteOneRecord', _id)!
    ).pipe(map((response) => response.result));
  }

  insertTheMealDetail(data: IMeal): Observable<IInsertDetail> {
    return from(
      this.userDetail?.functions.callFunction('insertTheMealDetail', data)!
    ).pipe(map((response) => response.result));
  }

  checkDataExistForToday__Copy({
    mealConsumedDate,
    mealTime,
  }: Pick<
    IMealsConsumptionDetail,
    'mealConsumedDate' | 'mealTime'
  >): Observable<IMealsConsumptionDetail[]> {
    return from(
      this.userDetail?.functions.callFunction('checkDataExistForToday', {
        mealConsumedDate,
        mealTime,
      })!
    ).pipe(map((response) => response.result));
  }

  deleteAllRecords() {
    this.getAllMealDetails()
      .pipe(
        mergeMap((mealDetailRes) => {
          return mealDetailRes.length
            ? this.deleteAllRecordsFromDb()
            : of(null);
        })
      )
      .subscribe((deleteResp) => {
        if (deleteResp?.deletedCount) {
          this.toaster.success(
            `${deleteResp.deletedCount} records are Deleted Successfully`
          );
          this.router.navigate(['meal-form']);
        } else {
          this.toaster.info('No Records to Delete');
          this.router.navigate(['meal-form']);
        }
      });
  }

  getMealDetailByDayWise(
    mealConsumptionDetails: IMealsConsumptionDetail[]
  ): mealDetailByDayWise {
    return mealConsumptionDetails.reduce((previousValue, eachDbValue) => {
      if (
        previousValue.hasOwnProperty(
          eachDbValue.day.concat('$', eachDbValue.mealConsumedDate)
        )
      ) {
        previousValue[
          eachDbValue.day.concat('$', eachDbValue.mealConsumedDate)
        ].push(eachDbValue);
      } else {
        previousValue[
          eachDbValue.day.concat('$', eachDbValue.mealConsumedDate)
        ] = [eachDbValue];
      }
      return previousValue;
    }, {} as mealDetailByDayWise);
  }

  getMealDetailByWeek(
    mealDayWiseDetails: mealDetailByDayWise
  ): mealDetailByWeekWise {
    return Object.entries(mealDayWiseDetails).reduce(
      (previousValue, [weekDayValue, mealDetail]) => {
        const keyData = weekDayValue as keyof typeof weekDays;
        const data = this.filterMealsConsumptionArray(mealDetail);
        const value = this.filterMealDetailByUser(data);
        previousValue[keyData] = value;
        return previousValue;
      },
      {} as mealDetailByWeekWise
    );
  }

  filterMealConsumedUserAndFlatValue(
    mealValue: IMealsConsumptionDetail[]
  ): mealConsumptionDetailsWithUser[] {
    return mealValue
      .map((eachMealValue) => {
        const mealsConsumptionArray = eachMealValue.mealsConsumptionArray
          .filter((eachUser) => eachUser.mealsConsumed === 'Yes')
          .map((eachUserDetail) => ({
            ...eachMealValue,
            ...eachUserDetail,
          }));
        return mealsConsumptionArray;
      })
      .flat();
  }

  filterMealsConsumptionByKey(
    keyValue: keyof mealConsumptionDetailsWithUser,
    mealsConsumptionDetail: mealConsumptionDetailsWithUser[]
  ): Record<string, mealConsumptionDetailsWithUser[]> {
    return mealsConsumptionDetail.reduce(
      (
        per: Record<string, mealConsumptionDetailsWithUser[]>,
        cur: mealConsumptionDetailsWithUser
      ) => {
        const propKey = cur[keyValue] as string;
        if (per.hasOwnProperty(propKey)) {
          per[propKey].push(cur);
        } else {
          per[propKey] = [cur];
        }
        return per;
      },
      {} as Record<string, mealConsumptionDetailsWithUser[]>
    );
  }

  private filterMealDetailByUser(
    mealsConsumptionDetail: Record<string, IMealsConsumptionDetail[]>
  ): Record<string, mealConsumptionDetailsWithUser[]> {
    return Object.entries(mealsConsumptionDetail).reduce(
      (pre, [key, value]) => {
        pre[key] = this.filterMealConsumedUserAndFlatValue(value);
        return pre;
      },
      {} as Record<string, mealConsumptionDetailsWithUser[]>
    );
  }

  private filterMealsConsumptionArray(
    mealsConsumptionDetail: IMealsConsumptionDetail[]
  ): Record<string, IMealsConsumptionDetail[]> {
    return mealsConsumptionDetail.reduce(
      (
        per: Record<string, IMealsConsumptionDetail[]>,
        cur: IMealsConsumptionDetail
      ) => {
        if (per.hasOwnProperty(cur.mealTime)) {
          per[cur.mealTime].push(cur);
        } else {
          per[cur.mealTime] = [cur];
        }
        return per;
      },
      {} as Record<string, IMealsConsumptionDetail[]>
    );
  }

  private deleteAllRecordsFromDb(): Observable<IDeletedCount> {
    return from(
      this.userDetail?.functions.callFunction('deleteAllRecords')!
    ).pipe(map((response) => response.result));
  }
}
