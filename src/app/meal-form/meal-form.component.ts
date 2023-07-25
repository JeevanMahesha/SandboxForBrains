import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { DbAccess } from '../DB/DB.access';
import {
  MY_FORMATS,
  MealTime,
  MealsConsumed_Copy,
  weekDaysList,
} from '../app.model';
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
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
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
  mealTime = ['BreakFast', 'Lunch', 'Dinner'];
  mealsConsumedOptions = Object.values(MealsConsumed_Copy);
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

  mealTimeChanged(value: MealTime): void {
    let amountPerMeal = 0;
    if (value === MealTime.BreakFast || value === MealTime.Dinner) {
      amountPerMeal = 40;
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
    // mealDateControl?.patchValue(todayDate?.toLocaleDateString()!);
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
      mealsConsumed: this._fb.control<null | keyof typeof MealsConsumed_Copy>(
        MealsConsumed_Copy.Yes as keyof typeof MealsConsumed_Copy,
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
        this.mealTime[0],
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
      todayDate: this._fb.control<null | Date>(new Date(), Validators.required),
      amountPerMeal: this._fb.control<null | number>(40, Validators.required),
      mealDate: this._fb.control<null | Date>(new Date(), Validators.required),
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
    // const dataExist = await this._db.checkDataExistForToday({
    //   mealDate,
    //   mealTime,
    // });
    // if (dataExist.result.length) {
    //   this.toastr.error(`${mealTime} is already Updated`);
    //   this.pageLoading = false;
    //   this.mealForm = this.constructMealForm;
    //   return;
    // }
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
