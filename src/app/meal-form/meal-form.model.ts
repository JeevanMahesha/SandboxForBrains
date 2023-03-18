import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface IMealForm {
  mealTime: FormControl<string | null>;
  today: FormControl<Date | null>;
  mealDate: FormControl<string | null>;
  mealsConsumptionArray: FormArray<FormGroup<IMealsConsumptionArrayForm>>;
}

export interface IMealsConsumptionArrayForm {
  mealsConsumedUser: FormControl<null | string>;
  mealsConsumed: FormControl<null | string>;
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
