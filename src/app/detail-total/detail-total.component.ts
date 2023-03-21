import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IFinalDataList, ITotal, MealTimeDetail } from '../app.model';
import { DbAccess } from '../DB/DB.access';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-detail-total',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatProgressSpinnerModule],
  providers: [DbAccess],
  templateUrl: './detail-total.component.html',
  styleUrls: ['./detail-total.component.css'],
})
export class DetailTotalComponent implements OnInit {
  totalMealDetails: ITotal[] = [];
  pageLoading = true;
  userObjectData: IFinalDataList = {};
  constructor(private _db: DbAccess) {}

  async ngOnInit(): Promise<void> {
    const allData = await this._db.getAllRecords();
    this.totalMealDetails = this._db.restructureTheData(allData.result);
    this.userObjectData = this._db.restructureDataAsObject(
      this.totalMealDetails
    );
    this.pageLoading = false;
  }

  getGrandTotalAmount(allMealDetail: MealTimeDetail): number {
    return Object.values(allMealDetail)
      .map(({ total }) => total)
      .reduce(
        (previousValue, currentValue) => currentValue! + previousValue!,
        0
      );
  }
}
