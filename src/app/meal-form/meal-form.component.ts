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
import { ToastrService } from 'ngx-toastr';
import { MealsConsumed, MealTime, weekDaysList } from '../app.model';
import { DbAccess } from '../DB/DB.access';
import { HeaderComponent } from '../header/header.component';
import { IMealForm, IMealsConsumptionArrayForm } from './meal-form.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  providers: [DbAccess],
  templateUrl: './meal-form.component.html',
  styles: [
    `
      .spinner {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    `,
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
  ];
  mealTime = ['BreakFast', 'Lunch', 'Dinner'];
  mealsConsumedOptions = ['yes', 'no'];
  mealForm: FormGroup<IMealForm>;
  pageLoading = false;

  constructor(
    private _fb: FormBuilder,
    private _db: DbAccess,
    private toastr: ToastrService
  ) {
    this.mealForm = this.constructMealForm;
  }

  get getMealsConsumptionArrayControls() {
    return (this.mealForm.get('mealsConsumptionArray') as FormArray).controls;
  }

  mealTimeChanged(value: MealTime): void {
    let amountPerMeal = 0;
    if (value === MealTime.BreakFast || value === MealTime.Dinner) {
      amountPerMeal = 50;
    } else {
      amountPerMeal = 60;
    }
    this.mealForm.get('amountPerMeal')?.patchValue(amountPerMeal);
  }

  updateMealDataValue(): void {
    const { todayDate } = this.mealForm.value;
    const mealDateControl = this.mealForm.get('mealDate');
    const dayControl = this.mealForm.get('day');
    dayControl?.patchValue(weekDaysList.at(todayDate?.getDay()!)!);
    mealDateControl?.patchValue(todayDate?.toLocaleDateString()!);
  }

  mealsConsumedValueChanged(): void {
    const mealsConsumedTotalCount =
      this.mealForm.value.mealsConsumptionArray?.filter(
        (eachValue) => eachValue.mealsConsumed === MealsConsumed.Yes
      ).length;
    const mealsConsumedTotalCountControl = this.mealForm.get(
      'mealsConsumedTotalCount'
    );
    mealsConsumedTotalCountControl?.patchValue(mealsConsumedTotalCount!);
  }

  private get constructMealForm(): FormGroup<IMealForm> {
    const mealsConsumptionArray = this.userNameList.map((eachUserName) =>
      this._fb.group<IMealsConsumptionArrayForm>({
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
      day: this._fb.control(
        { value: weekDaysList[new Date().getDay()], disabled: true },
        Validators.required
      ),
      mealsConsumedTotalCount: this._fb.control(
        { disabled: true, value: this.userNameList.length },
        [Validators.required, Validators.min(1)]
      ),
      todayDate: this._fb.control(new Date(), Validators.required),
      amountPerMeal: this._fb.control(50, Validators.required),
      mealDate: this._fb.control(
        new Date().toLocaleDateString(),
        Validators.required
      ),
      mealsConsumptionArray: this._fb.array(
        mealsConsumptionArray,
        Validators.required
      ),
    });
  }

  async submitTheForm(): Promise<void> {
    this.pageLoading = true;
    this.mealForm.enable();
    const mealFormValue = this.mealForm.value;
    const { mealDate = null, mealTime = null } = mealFormValue;
    const dataExist = await this._db.checkDataExistForToday({
      mealDate,
      mealTime,
    });
    if (dataExist.result.length) {
      this.toastr.error(`${mealTime} is already Updated`);
      this.pageLoading = false;
      this.mealForm = this.constructMealForm;
      return;
    }
    this._db
      .insertTheMealDetail(mealFormValue)
      .then((res) => {
        if (res.result.insertedId) {
          this.toastr.success(
            `${mealTime} on ${mealDate} is saved`,
            'Successfully'
          );
          this.mealForm = this.constructMealForm;
          this.pageLoading = false;
        } else {
          this.toastr.error('Unable to save the record');
        }
      })
      .catch((error) => {
        if (error) {
          console.log(error);
        }
      });
  }
}
