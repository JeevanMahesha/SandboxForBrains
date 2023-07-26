import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { DbAccess } from '../DB/DB.access';
import { MealCost, MealTime, MealsConsumed, weekDaysList } from '../app.model';
import { HeaderComponent } from '../header/header.component';
import { IMealForm, IMealsConsumptionArrayForm } from './meal-form.model';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './meal-form.component.html',
  styles: [
    `
      .mg-rt {
        margin-right: 5px;
      }
    `,
  ],
})
export class MealFormComponent {
  userNameList = [
    'Jeevan',
    'Dharamraj',
    'Praveen',
    'Deepak',
    'SaravanaKumaran',
    'RajKumar',
    'Suryaraj',
  ];
  mealTime = Object.values(MealTime);
  mealsConsumedOptions = Object.values(MealsConsumed);
  mealForm: FormGroup<IMealForm>;
  pageLoading = false;

  constructor(
    private _fb: NonNullableFormBuilder,
    private _db: DbAccess,
    private toastr: ToastrService
  ) {
    this.mealForm = this.constructMealForm;
  }

  get getMealsConsumptionArrayControls() {
    return (this.mealForm.get('mealsConsumptionArray') as FormArray).controls;
  }

  mealTimeChanged(value: keyof typeof MealTime): void {
    let amountPerMeal = 0;
    if (value === 'BreakFast' || value === 'Dinner') {
      amountPerMeal = MealCost.BreakFast;
    } else {
      amountPerMeal = MealCost.Lunch;
    }
    this.mealForm.get('amountPerMeal')?.patchValue(amountPerMeal);
  }

  updateMealDataValue(): void {
    const mealDateControl = this.mealForm.get('mealDate')?.value;
    const dayControl = this.mealForm.get('day');
    const mealConsumedDateControl = this.mealForm.get('mealConsumedDate');
    mealConsumedDateControl?.patchValue(mealDateControl?.toLocaleDateString()!);
    dayControl?.patchValue(weekDaysList.at(mealDateControl?.getDay()!)!);
  }

  mealsConsumedValueChanged(): void {
    const mealsConsumedTotalCount =
      this.mealForm.value.mealsConsumptionArray?.filter(
        (eachValue) => eachValue.mealsConsumed === 'Yes'
      ).length;
    const mealsConsumedTotalCountControl = this.mealForm.get(
      'mealsConsumedTotalCount'
    );
    mealsConsumedTotalCountControl?.patchValue(mealsConsumedTotalCount!);
  }

  addNewUser(): void {
    const newData = this.addUserToMealsConsumptionArray(null);
    newData.get('mealsConsumedUser')?.enable();
    (this.mealForm.get('mealsConsumptionArray') as FormArray).push(newData);
    this.mealsConsumedValueChanged();
  }

  checkMealsConsumedUserDisabled(index: number): boolean {
    return (this.mealForm.get('mealsConsumptionArray') as FormArray)
      .at(index)
      .get('mealsConsumedUser')?.enabled!;
  }

  removeMealsConsumedUser(index: number): void {
    (this.mealForm.get('mealsConsumptionArray') as FormArray).removeAt(index);
    this.mealsConsumedValueChanged();
  }

  private addUserToMealsConsumptionArray(
    userName: string | null
  ): FormGroup<IMealsConsumptionArrayForm> {
    return this._fb.group<IMealsConsumptionArrayForm>({
      mealsConsumedUser: this._fb.control<null | string>(
        { value: userName, disabled: true },
        Validators.required
      ),
      mealsConsumed: this._fb.control<null | keyof typeof MealsConsumed>(
        MealsConsumed.Yes as keyof typeof MealsConsumed,
        Validators.required
      ),
    });
  }

  private get constructMealForm(): FormGroup<IMealForm> {
    const mealsConsumptionArray = this.userNameList.map(
      this.addUserToMealsConsumptionArray.bind(this)
    );
    return this._fb.group({
      mealTime: this._fb.control<null | string>(
        MealTime.BreakFast,
        Validators.required
      ),
      day: this._fb.control<null | string>(
        { value: weekDaysList[new Date().getDay()], disabled: true },
        Validators.required
      ),
      mealsConsumedTotalCount: this._fb.control<null | number>(
        { disabled: true, value: this.userNameList.length },
        [Validators.required, Validators.min(1)]
      ),
      mealConsumedDate: this._fb.control<null | string>(
        new Date().toLocaleDateString(),
        Validators.required
      ),
      amountPerMeal: this._fb.control<null | number>(
        MealCost.BreakFast,
        Validators.required
      ),
      mealDate: this._fb.control<null | Date>(new Date(), Validators.required),
      mealsConsumptionArray: this._fb.array(
        mealsConsumptionArray,
        Validators.required
      ),
    });
  }

  submitTheForm() {
    this.pageLoading = false;
    const mealFormValue = this.mealForm.getRawValue();
    const mealConsumedDate = mealFormValue.mealConsumedDate!;
    const mealTime = mealFormValue.mealTime! as keyof typeof MealTime;
    this._db
      .checkDataExistForToday__Copy({
        mealConsumedDate,
        mealTime,
      })
      .subscribe({
        next: (existDataRes) => {
          if (existDataRes.length) {
            this.toastr.error(`${mealTime} is already Updated`);
            this.pageLoading = false;
          } else {
            this._db
              .insertTheMealDetail(mealFormValue)
              .subscribe((insertRes) => {
                if (insertRes.insertedId) {
                  this.toastr.success(
                    `${mealTime} on ${mealConsumedDate} is saved`,
                    'Successfully'
                  );
                  this.mealForm = this.constructMealForm;
                  this.pageLoading = false;
                } else {
                  this.toastr.error('Unable to save the record');
                }
              });
          }
        },
        error: console.log,
      });
  }
}
