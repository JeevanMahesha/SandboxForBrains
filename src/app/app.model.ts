import { MatDateFormats } from '@angular/material/core';

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
  todayDate: Date | null;
  day: string | null;
  mealDate: string | null;
  mealsConsumptionArray: IMealsConsumptionArray[];
  amountPerMeal: number | null;
  _id?: string;
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

type allDetailEnum = 'allDetail';

export type MealTimeDetail = {
  [key in MealTime | allDetailEnum]: IEachMealDetail<ITotal[]>;
};

export interface IEachMealDetail<VL> {
  total: number;
  valueList: VL;
}

export interface IMealsConsumptionDetail {
  _id: string;
  mealTime: string;
  day: keyof typeof weekDays;
  mealsConsumedTotalCount: number;
  todayDate: Date;
  amountPerMeal: number;
  mealDate: string;
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

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
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
