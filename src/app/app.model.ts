export interface IMeal {
  mealTime: string | null;
  day: string | null;
  mealConsumedDate: string | null;
  mealDate: Date | null;
  amountPerMeal: number | null;
  mealsConsumedTotalCount: number | null;
  mealsConsumptionArray: IMealsConsumptionValue[];
  _id?: string;
}

export interface IMealsConsumptionValue {
  mealsConsumedUser: string | null;
  mealsConsumed: string | null;
}

export interface IMealsConsumptionDetail {
  _id?: string;
  mealTime: keyof typeof MealTime;
  day: keyof typeof weekDays;
  mealsConsumedTotalCount: number;
  mealConsumedDate: string;
  amountPerMeal: number;
  mealDate: Date;
  mealsConsumptionArray: IMealsConsumptionArray[];
}

export interface IMealsConsumptionArray {
  mealsConsumedUser: string;
  mealsConsumed: keyof typeof MealsConsumed;
}

export const MealsConsumed = {
  Yes: 'Yes',
  No: 'No',
};

export const weekDays = {
  Sunday: 'Sunday',
  Monday: 'Monday',
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
    IMealsConsumptionArray {}

export const MealTime = {
  BreakFast: 'BreakFast',
  Lunch: 'Lunch',
  Dinner: 'Dinner',
};

export const MealCost = {
  BreakFast: 40,
  Dinner: 40,
  Lunch: 60,
};

export type IMealAmountDetail = {
  [k in keyof typeof MealTime]: number;
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

// export type IReport = Pick<
//   IMealsConsumptionDetail,
//   'mealTime' | 'mealsConsumedTotalCount' | 'day'
// >;

export interface IReport
  extends IMealAmountDetail,
    Pick<IMealsConsumptionDetail, 'day'> {}
