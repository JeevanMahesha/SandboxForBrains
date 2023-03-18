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
import { DbAccess } from '../DB/DB.access';
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
  ],
  providers: [DbAccess],
  templateUrl: './meal-form.component.html',
})
export class MealFormComponent {
  userNameList = ['Jeevan', 'Dharamraj', 'Praveen', 'Deepak', 'SaravanaKumar'];
  mealTime = ['BreakFast', 'Lunch', 'Dinner'];
  mealsConsumedOptions = ['yes', 'no'];
  mealForm: FormGroup<IMealForm>;

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

  updateMealDataValue(): void {
    const { today } = this.mealForm.value;
    const control = this.mealForm.get('mealDate');
    control?.patchValue(today?.toLocaleDateString()!);
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
      today: this._fb.control(new Date(), Validators.required),
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
    this.mealForm.enable();
    const mealFormValue = this.mealForm.value;
    const { mealDate = null, mealTime = null } = mealFormValue;
    const dataExist = await this._db.checkDataExistForToday({
      mealDate,
      mealTime,
    });
    if (dataExist.result.length) {
      this.toastr.error(`${mealTime} is already Updated`);
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
