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

export type ITotal = Omit<IMeal, 'mealsConsumptionArray' | 'todayDate'> &
  IMealsConsumptionArray;

export interface IMeal {
  mealTime: string | null;
  todayDate: Date | null;
  day: string | null;
  mealDate: string | null;
  mealsConsumptionArray: IMealsConsumptionArray[];
  amountPerMeal: number | null;
  mealCount: number | null;
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
