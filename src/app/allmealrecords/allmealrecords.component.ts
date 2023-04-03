import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { DbAccess } from '../DB/DB.access';
import { MatDialogModule } from '@angular/material/dialog';
import { ITotal } from '../app.model';

@Component({
  selector: 'app-allmealrecords',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatDialogModule],
  providers: [DbAccess],
  templateUrl: './allmealrecords.component.html',
  styleUrls: ['./allmealrecords.component.css'],
})
export class AllmealrecordsComponent {
  totalMealDetails: ITotal[] = [];
  pageLoading = true;
  constructor(private _db: DbAccess) {}

  async ngOnInit(): Promise<void> {
    const allData = await this._db.getAllRecords();
    this.totalMealDetails = this._db
      .restructureTheData(allData.result)
      .sort((a, b) => a.todayDate?.getUTCDate()! - b.todayDate?.getUTCDate()!);
    console.log(this.totalMealDetails);

    this.pageLoading = false;
  }
}
