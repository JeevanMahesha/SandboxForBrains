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
  todayDate: Date | null;
  day: string | null;
  mealDate: string | null;
  mealsConsumptionArray: IMealsConsumptionArray[];
}

export interface IMealsConsumptionArray {
  mealsConsumedUser: string;
  mealsConsumed: string;
}

export const weekDaysList = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
