import { Injectable } from '@angular/core';
import { App, Credentials } from 'realm-web';
import { environmentValues } from 'src/environment/environment';
import {
  IEachMealDetail,
  IFinalDataList,
  IMeal,
  ITotal,
  IUserObjectData,
  MealsConsumed,
  MealTime,
  MealTimeDetail,
} from '../app.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class DbAccess {
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
}
