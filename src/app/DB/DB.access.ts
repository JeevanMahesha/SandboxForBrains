import { Injectable } from '@angular/core';
import { App, Credentials } from 'realm-web';
import { environmentValues } from 'src/environment/environment';
import { IMeal, ITotal, IUserObjectData } from '../app.model';

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
  }: Omit<IMeal, 'mealsConsumptionArray' | 'todayDate' | 'day'>) {
    const userConnection = await this.getCredentials();
    return await userConnection.functions.callFunction(
      'checkDataExistForToday',
      { mealDate, mealTime }
    );
  }

  restructureTheData(mealArray: IMeal[]): ITotal[] {
    const totalMealDetails: ITotal[] = [];
    mealArray.forEach(({ mealDate, mealTime, mealsConsumptionArray }) => {
      const totalEachDate = mealsConsumptionArray.map((eachUser) => ({
        ...eachUser,
        mealDate,
        mealTime,
      }));
      totalMealDetails.push(...totalEachDate);
    });
    return totalMealDetails;
  }

  restructureDataAsObject(mealData: ITotal[]): IUserObjectData {
    const userData: IUserObjectData = {};
    mealData.forEach((eachData) => {
      if (userData.hasOwnProperty(eachData.mealsConsumedUser)) {
        userData[eachData.mealsConsumedUser].push(eachData);
      } else {
        userData[eachData.mealsConsumedUser] = [eachData];
      }
    });
    return userData;
  }

  private async getCredentials() {
    const app = new App({ id: environmentValues.REALM_APP_ID });
    const credentials = Credentials.apiKey(environmentValues.REALM_API_KEY);
    return await app.logIn(credentials);
  }
}
