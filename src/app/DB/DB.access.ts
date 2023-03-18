import { Injectable } from '@angular/core';
import { App, Credentials } from 'realm-web';
import { environmentValues } from 'src/environment/environment';
import { IMeal } from '../meal-form/meal-form.model';

@Injectable()
export class DbAccess {
  private allMealDetails: IMeal[] = [];

  constructor() {
    this.getAllRecords();
  }

  get getAllMealDetails(): IMeal[] {
    return this.allMealDetails;
  }

  private async getCredentials() {
    const app = new App({ id: environmentValues.REALM_APP_ID });
    const credentials = Credentials.apiKey(environmentValues.REALM_API_KEY);
    return await app.logIn(credentials);
  }

  private async getAllRecords() {
    try {
      const userConnection = await this.getCredentials();
      const allMealDetailsValue = await userConnection.functions.callFunction(
        'getAllMealDetails'
      );
      this.allMealDetails = allMealDetailsValue;
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
  }: Omit<IMeal, 'mealsConsumptionArray' | 'today'>) {
    const userConnection = await this.getCredentials();
    return await userConnection.functions.callFunction(
      'checkDataExistForToday',
      { mealDate, mealTime }
    );
  }
}
