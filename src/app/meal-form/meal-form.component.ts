import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { HeaderComponent } from '../header/header.component';
import { IMealForm, IMealsConsumptionArray } from './meal-form.model';

@Component({
  selector: 'app-meal-form',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    HeaderComponent,
  ],
  templateUrl: './meal-form.component.html',
})
export class MealFormComponent {
  userNameList = ['Jeevan', 'Dharamraj', 'Praveen', 'Deepak', 'SaravanaKumar'];
  mealTime = ['BreakFast', 'Lunch', 'Dinner'];
  mealsConsumedOptions = ['yes', 'No'];
  mealForm: FormGroup<IMealForm>;

  constructor(private _fb: FormBuilder) {
    this.mealForm = this.constructMealForm();
    console.log(this.mealForm);
  }

  get getMealsConsumptionArrayControls() {
    return (this.mealForm.get('mealsConsumptionArray') as FormArray).controls;
  }

  submitTheForm(): void {
    this.mealForm.enable();
    console.log(this.mealForm.value);
  }

  private constructMealForm(): FormGroup<IMealForm> {
    const mealsConsumptionArray = this.userNameList.map((eachUserName) =>
      this._fb.group<IMealsConsumptionArray>({
        mealsConsumedUser: this._fb.control<null | string>(
          { value: eachUserName, disabled: true },
          Validators.required
        ),
        mealsConsumed: this._fb.control<null | string>(
          this.mealsConsumedOptions[0],
          Validators.required
        ),
      })
    );
    return this._fb.group({
      mealTime: this._fb.control(this.mealTime[0], Validators.required),
      mealDate: this._fb.control(new Date(), Validators.required),
      mealsConsumptionArray: this._fb.array(
        mealsConsumptionArray,
        Validators.required
      ),
    });
  }
}
