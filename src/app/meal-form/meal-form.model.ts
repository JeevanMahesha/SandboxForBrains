import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface IMealForm {
  mealTime: FormControl<string | null>;
  mealDate: FormControl<Date | null>;
  mealsConsumptionArray: FormArray<FormGroup<IMealsConsumptionArray>>;
}

export interface IMealsConsumptionArray {
  mealsConsumedUser: FormControl<null | string>;
  mealsConsumed: FormControl<null | string>;
}
