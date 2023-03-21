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

@Injectable()
export class DbAccess {
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

  async deleteAllRecords() {
    const userConnection = await this.getCredentials();
    return await userConnection.functions.callFunction('deleteAllRecords');
  }

  restructureTheData(mealArray: IMeal[]): ITotal[] {
    const totalMealDetails: ITotal[] = [];
    mealArray.forEach(
      ({ mealDate, mealTime, mealsConsumptionArray, day, amountPerMeal }) => {
        const totalEachDate = mealsConsumptionArray.map((eachUser) => ({
          ...eachUser,
          mealDate,
          mealTime,
          day,
          amountPerMeal,
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
      tempObj.allDetail.valueList = value;

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
    tempObj.valueList = mealValueList.filter(
      (eachMealValue) =>
        eachMealValue.mealTime === MealTime[mealTime] &&
        eachMealValue.mealsConsumed === MealsConsumed.Yes
    );
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
}
