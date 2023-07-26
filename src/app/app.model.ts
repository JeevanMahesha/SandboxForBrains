export interface IMeal {
  mealTime: string | null;
  day: string | null;
  mealConsumedDate: string | null;
  mealDate: Date | null;
  amountPerMeal: number | null;
  mealsConsumedTotalCount: number | null;
  mealsConsumptionArray: IMealsConsumptionArray[];
  _id?: string;
}

export interface IMealsConsumptionArray {
  mealsConsumedUser: string | null;
  mealsConsumed: string | null;
}

export interface IMealsConsumptionDetail {
  _id?: string;
  mealTime: keyof typeof MealTime_Copy;
  day: keyof typeof weekDays;
  mealsConsumedTotalCount: number;
  mealConsumedDate: string;
  amountPerMeal: number;
  mealDate: Date;
  mealsConsumptionArray: IMealsConsumptionArray_Copy[];
}

export interface IMealsConsumptionArray_Copy {
  mealsConsumedUser: string;
  mealsConsumed: keyof typeof MealsConsumed_Copy;
}

export const MealsConsumed_Copy = {
  Yes: 'Yes',
  No: 'No',
};

export const weekDays = {
  Monday: 'Monday',
  Sunday: 'Sunday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
};

export type mealDetailByDayWise = Record<string, IMealsConsumptionDetail[]>;

export type mealDetailByWeekWise = {
  [key in string]: Record<string, mealConsumptionDetailsWithUser[]>;
};

export interface mealConsumptionDetailsWithUser
  extends IMealsConsumptionDetail,
    IMealsConsumptionArray_Copy {}

export const MealTime_Copy = {
  BreakFast: 'BreakFast',
  Dinner: 'Dinner',
  Lunch: 'Lunch',
};

export const MealCost_Copy = {
  BreakFast: 40,
  Dinner: 40,
  Lunch: 60,
};

export type IMealAmountDetail = {
  [k in keyof typeof MealTime_Copy]: number;
};

export interface ITotalMealAmountDetail extends Partial<IMealAmountDetail> {
  mealsConsumedUser: string;
  totalMealAmount: number;
}

export interface IDeletedCount {
  deletedCount: number;
}

export interface IInsertDetail {
  insertedId: string;
}

export const weekDaysList = Object.values(weekDays);
