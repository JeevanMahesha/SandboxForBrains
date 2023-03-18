import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DbAccess } from '../DB/DB.access';
import { HeaderComponent } from '../header/header.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { IMeal } from '../meal-form/meal-form.model';
import { ITotal } from './total.model';

@Component({
  selector: 'app-total',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.css'],
  providers: [DbAccess],
})
export class TotalComponent implements OnInit {
  allMealDetails: IMeal[] = [];
  totalMealDetails: ITotal[] = [];
  constructor(private _db: DbAccess) {}

  async ngOnInit(): Promise<void> {
    const allData = await this._db.getAllRecords();
    this.allMealDetails = allData.result;
    console.log(this.allMealDetails);

    this.allMealDetails.forEach(
      ({ mealDate, mealTime, mealsConsumptionArray }) => {
        const totalEachDate = mealsConsumptionArray.map((eachUser) => ({
          ...eachUser,
          mealDate,
          mealTime,
        }));
        this.totalMealDetails.push(...totalEachDate);
      }
    );
    console.log(this.totalMealDetails);
  }
}
