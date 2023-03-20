import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ITotal, IUserObjectData, MealsConsumed, MealTime } from '../app.model';
import { DbAccess } from '../DB/DB.access';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-detail-total',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  providers: [DbAccess],
  templateUrl: './detail-total.component.html',
  styleUrls: ['./detail-total.component.css'],
})
export class DetailTotalComponent implements OnInit {
  totalMealDetails: ITotal[] = [];
  userObjectData: IUserObjectData = {};
  mealTime = ['BreakFast', 'Dinner'];
  constructor(private _db: DbAccess) {}

  async ngOnInit(): Promise<void> {
    const allData = await this._db.getAllRecords();
    this.totalMealDetails = this._db.restructureTheData(allData.result);
    this.userObjectData = this._db.restructureDataAsObject(
      this.totalMealDetails
    );
  }

  getMealTimeAmount(mealTime: string, userValue: ITotal[]) {
    return userValue.filter(
      (eachData) =>
        eachData.mealTime === mealTime &&
        eachData.mealsConsumed === MealsConsumed.Yes
    ).length;
  }
}
