import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MealsConsumed_Copy } from '../app.model';

export interface IMealForm {
  mealTime: FormControl<string | null>;
  day: FormControl<string | null>;
  mealConsumedDate: FormControl<string | null>;
  mealDate: FormControl<Date | null>;
  amountPerMeal: FormControl<number | null>;
  mealsConsumedTotalCount: FormControl<number | null>;
  mealsConsumptionArray: FormArray<FormGroup<IMealsConsumptionArrayForm>>;
}

export interface IMealsConsumptionArrayForm {
  mealsConsumedUser: FormControl<null | string>;
  mealsConsumed: FormControl<null | keyof typeof MealsConsumed_Copy>;
}
