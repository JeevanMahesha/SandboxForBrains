import { Injectable } from '@angular/core';
import { App, Credentials, User } from 'realm-web';
import { environmentValues } from 'src/environment/environment';
import {
  IEachMealDetail,
  IFinalDataList,
  IMeal,
  IMealsConsumptionDetail,
  ITotal,
  IUserObjectData,
  mealConsumptionDetailsWithUser,
  mealDetailByDayWise,
  mealDetailByWeekWise,
  MealsConsumed,
  MealTime,
  MealTimeDetail,
  weekDays,
} from '../app.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable, from, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DbAccess {
  userDetail: User<
    Realm.DefaultFunctionsFactory,
    SimpleObject,
    Realm.DefaultUserProfileData
  > | null = null;
  constructor(private toaster: ToastrService, private router: Router) {}

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

  private async deleteAllRecordsFromDb() {
    const userConnection = await this.getCredentials();
    return await userConnection.functions.callFunction('deleteAllRecords');
  }

  restructureTheData(mealArray: IMeal[]): ITotal[] {
    const totalMealDetails: ITotal[] = [];
    mealArray.forEach(
      ({
        mealDate,
        mealTime,
        mealsConsumptionArray,
        day,
        amountPerMeal,
        todayDate,
        _id,
      }) => {
        const totalEachDate = mealsConsumptionArray.map((eachUser) => ({
          ...eachUser,
          mealDate,
          mealTime,
          day,
          amountPerMeal,
          todayDate,
          _id,
        }));
        totalMealDetails.push(...totalEachDate);
      }
    );
    return totalMealDetails;
  }

  restructureDataAsObject(mealData: ITotal[]): IFinalDataList {
    const userData: IUserObjectData = {};
    const userDataFinal: IFinalDataList = {};
    mealData.forEach((eachData) => {
      if (userData.hasOwnProperty(eachData.mealsConsumedUser)) {
        userData[eachData.mealsConsumedUser].push(eachData);
      } else {
        userData[eachData.mealsConsumedUser] = [eachData];
      }
    });
    Object.entries(userData).forEach(([key, value]) => {
      const tempObj: MealTimeDetail = {
        [MealTime.BreakFast]: {
          total: 0,
          valueList: [],
        },
        [MealTime.Dinner]: {
          total: 0,
          valueList: [],
        },
        [MealTime.Lunch]: {
          total: 0,
          valueList: [],
        },
        allDetail: {
          total: 0,
          valueList: [],
        },
      };
      tempObj.BreakFast = this.getSpecificMealList(value, MealTime.BreakFast);
      tempObj.Lunch = this.getSpecificMealList(value, MealTime.Lunch);
      tempObj.Dinner = this.getSpecificMealList(value, MealTime.Dinner);
      tempObj.allDetail.valueList = value.sort(
        (a, b) => a.todayDate?.getUTCDate()! - b.todayDate?.getUTCDate()!
      );

      userDataFinal[key] = {
        ...tempObj,
      };
    });

    return userDataFinal;
  }

  private getSpecificMealList(
    mealValueList: ITotal[],
    mealTime: MealTime
  ): IEachMealDetail<ITotal[]> {
    const tempObj: IEachMealDetail<ITotal[]> = {
      total: 0,
      valueList: [],
    };
    tempObj.valueList = mealValueList
      .filter(
        (eachMealValue) =>
          eachMealValue.mealTime === MealTime[mealTime] &&
          eachMealValue.mealsConsumed === MealsConsumed.Yes
      )
      .sort((a, b) => a.todayDate?.getUTCDate()! - b.todayDate?.getUTCDate()!);
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

  async deleteAllRecords(): Promise<void> {
    const allData = await this.getAllRecords();
    if (!allData.result.length) {
      this.toaster.info('No Records to Delete');
      this.router.navigate(['meal-form']);
      return;
    }
    this.deleteAllRecordsFromDb()
      .then((res) => {
        if (res.result.deletedCount) {
          this.toaster.success(
            `${res.result.deletedCount} records are Deleted Successfully`
          );
          this.router.navigate(['meal-form']);
        }
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          this.toaster.error('Something went Wrong');
        }
      });
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

  private filterMealDetailByUser(
    mealsConsumptionDetail: Record<string, IMealsConsumptionDetail[]>
  ): Record<string, mealConsumptionDetailsWithUser[]> {
    return Object.entries(mealsConsumptionDetail).reduce(
      (pre, [key, value]) => {
        pre[key] = value
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
}
