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

export interface IFinalDataList {
  [k: string]: MealTimeDetail;
}

export type ITotal = Omit<IMeal, 'mealsConsumptionArray'> &
  IMealsConsumptionArray;

export interface IMeal {
  mealTime: string | null;
  day: string | null;
  todayDate: Date | null;
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

export const weekDaysList = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

type allDetailEnum = 'allDetail';

export type MealTimeDetail = {
  [key in MealTime | allDetailEnum]: IEachMealDetail<ITotal[]>;
};

export interface IEachMealDetail<VL> {
  total: number;
  valueList: VL;
}

export interface IMealsConsumptionDetail {
  _id?: string;
  mealTime: keyof typeof MealTime_Copy;
  day: keyof typeof weekDays;
  mealsConsumedTotalCount: number;
  todayDate: Date;
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
