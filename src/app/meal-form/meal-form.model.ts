import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface IMealForm {
  mealTime: FormControl<string | null>;
  day: FormControl<string | null>;
  todayDate: FormControl<Date | null>;
  mealDate: FormControl<string | null>;
  amountPerMeal: FormControl<number | null>;
  mealCount: FormControl<number | null>;
  mealsConsumptionArray: FormArray<FormGroup<IMealsConsumptionArrayForm>>;
}

export interface IMealsConsumptionArrayForm {
  mealsConsumedUser: FormControl<null | string>;
  mealsConsumed: FormControl<null | string>;
}
