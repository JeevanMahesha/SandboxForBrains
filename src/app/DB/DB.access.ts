import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { App, Credentials, User } from 'realm-web';
import { Observable, from, map, mergeMap, of } from 'rxjs';
import { environmentValues } from 'src/environment/environment';
import {
  IDeletedCount,
  IEachMealDetail,
  IInsertDetail,
  IMeal,
  IMealsConsumptionDetail,
  ITotal,
  MealTime,
  MealsConsumed,
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

  async deleteOneRecord(_id: string) {
    try {
      const userConnection = await this.getCredentials();
      return userConnection.functions.callFunction('deleteOneRecord', _id);
    } catch (error) {
      console.error(error);
    }
  }

  async getAllRecords() {
    try {
      const userConnection = await this.getCredentials();
      return userConnection.functions.callFunction('getAllMealDetails');
    } catch (error) {
      console.error(error);
    }
  }

  async insertTheMealDetail(data: any) {
    const userConnection = await this.getCredentials();
    return await userConnection.functions.callFunction(
      'insertTheMealDetail',
      data
    );
  }

  async checkDataExistForToday({
    mealDate,
    mealTime,
  }: Pick<IMeal, 'mealDate' | 'mealTime'>) {
    const userConnection = await this.getCredentials();
    return await userConnection.functions.callFunction(
      'checkDataExistForToday',
      { mealDate, mealTime }
    );
  }

  // restructureTheData(mealArray: IMeal[]): ITotal[] {
  //   const totalMealDetails: ITotal[] = [];
  //   mealArray.forEach(
  //     ({
  //       mealDate,
  //       mealTime,
  //       mealsConsumptionArray,
  //       day,
  //       amountPerMeal,
  //       todayDate,
  //       _id,
  //     }) => {
  //       const totalEachDate = mealsConsumptionArray.map((eachUser) => ({
  //         ...eachUser,
  //         mealDate,
  //         mealTime,
  //         day,
  //         amountPerMeal,
  //         todayDate,
  //         _id,
  //       }));
  //       totalMealDetails.push(...totalEachDate);
  //     }
  //   );
  //   return totalMealDetails;
  // }

  // restructureDataAsObject(mealData: ITotal[]): IFinalDataList {
  //   const userData: IUserObjectData = {};
  //   const userDataFinal: IFinalDataList = {};
  //   mealData.forEach((eachData) => {
  //     if (userData.hasOwnProperty(eachData.mealsConsumedUser)) {
  //       userData[eachData.mealsConsumedUser].push(eachData);
  //     } else {
  //       userData[eachData.mealsConsumedUser] = [eachData];
  //     }
  //   });
  //   Object.entries(userData).forEach(([key, value]) => {
  //     const tempObj: MealTimeDetail = {
  //       [MealTime.BreakFast]: {
  //         total: 0,
  //         valueList: [],
  //       },
  //       [MealTime.Dinner]: {
  //         total: 0,
  //         valueList: [],
  //       },
  //       [MealTime.Lunch]: {
  //         total: 0,
  //         valueList: [],
  //       },
  //       allDetail: {
  //         total: 0,
  //         valueList: [],
  //       },
  //     };
  //     tempObj.BreakFast = this.getSpecificMealList(value, MealTime.BreakFast);
  //     tempObj.Lunch = this.getSpecificMealList(value, MealTime.Lunch);
  //     tempObj.Dinner = this.getSpecificMealList(value, MealTime.Dinner);
  //     // tempObj.allDetail.valueList = value.sort(
  //     //   (a, b) => a.todayDate?.getUTCDate()! - b.todayDate?.getUTCDate()!
  //     // );

  //     userDataFinal[key] = {
  //       ...tempObj,
  //     };
  //   });

  //   return userDataFinal;
  // }

  private getSpecificMealList(
    mealValueList: ITotal[],
    mealTime: MealTime
  ): IEachMealDetail<ITotal[]> {
    const tempObj: IEachMealDetail<ITotal[]> = {
      total: 0,
      valueList: [],
    };
    tempObj.valueList = mealValueList.filter(
      (eachMealValue) =>
        eachMealValue.mealTime === MealTime[mealTime] &&
        eachMealValue.mealsConsumed === MealsConsumed.Yes
    );
    // .sort((a, b) => a.todayDate?.getUTCDate()! - b.todayDate?.getUTCDate()!);
    tempObj.total =
      tempObj.valueList
        .map(({ amountPerMeal }) => amountPerMeal)
        .reduce(
          (previousValue, currentValue) => currentValue! + previousValue!,
          0
        ) || 0;
    return tempObj;
  }

  private async getCredentials() {
    const app = new App({ id: environmentValues.REALM_APP_ID });
    const credentials = Credentials.apiKey(environmentValues.REALM_API_KEY);
    return await app.logIn(credentials);
  }

  getCredentials_Copy(): void {
    const app = new App({ id: environmentValues.REALM_APP_ID });
    const credentials = Credentials.apiKey(environmentValues.REALM_API_KEY);
    app
      .logIn(credentials)
      .then((userResponse) => (this.userDetail = userResponse));
  }

  getAllMealDetails_Copy(): Observable<IMealsConsumptionDetail[]> {
    return from(
      this.userDetail?.functions.callFunction('getAllMealDetails')!
    ).pipe(map((response) => response.result));
  }

  deleteOneRecord__Copy(_id: string): Observable<IDeletedCount> {
    return from(
      this.userDetail?.functions.callFunction('deleteOneRecord', _id)!
    ).pipe(map((response) => response.result));
  }

  insertTheMealDetail__Copy(data: IMeal): Observable<IInsertDetail> {
    return from(
      this.userDetail?.functions.callFunction('insertTheMealDetail', data)!
    ).pipe(map((response) => response.result));
  }

  checkDataExistForToday__Copy({
    mealDate,
    mealTime,
  }: Pick<IMealsConsumptionDetail, 'mealDate' | 'mealTime'>): Observable<
    IMealsConsumptionDetail[]
  > {
    return from(
      this.userDetail?.functions.callFunction('checkDataExistForToday', {
        mealDate,
        mealTime,
      })!
    ).pipe(map((response) => response.result));
  }

  deleteAllRecords__Copy() {
    this.getAllMealDetails_Copy()
      .pipe(
        mergeMap((mealDetailRes) => {
          return mealDetailRes.length
            ? this.deleteAllRecordsFromDb__Copy()
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
      if (previousValue.hasOwnProperty(eachDbValue.day)) {
        previousValue[eachDbValue.day].push(eachDbValue);
      } else {
        previousValue[eachDbValue.day] = [eachDbValue];
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

  private deleteAllRecordsFromDb__Copy(): Observable<IDeletedCount> {
    return from(
      this.userDetail?.functions.callFunction('deleteAllRecords')!
    ).pipe(map((response) => response.result));
  }
}
