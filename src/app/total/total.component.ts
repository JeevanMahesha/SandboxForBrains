import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IMeal, ITotal } from '../app.model';
import { DbAccess } from '../DB/DB.access';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-total',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
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
    this.totalMealDetails = this._db.restructureTheData(this.allMealDetails);
  }
}
