export enum MealTime {
  BreakFast = 'BreakFast',
  Dinner = 'Dinner',
  Lunch = 'Lunch',
}

export enum MealsConsumed {
  No = 'no',
  Yes = 'yes',
}

export interface IUserObjectData {
  [key: string]: ITotal[];
}

export interface ITotal {
  mealsConsumedUser: string;
  mealsConsumed: string;
  mealDate: string | null;
  mealTime: string | null;
}

export interface IMeal {
  mealTime: string | null;
  today: Date | null;
  mealDate: string | null;
  mealsConsumptionArray: IMealsConsumptionArray[];
}

export interface IMealsConsumptionArray {
  mealsConsumedUser: string;
  mealsConsumed: string;
}
