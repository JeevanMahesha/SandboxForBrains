import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DbAccess } from '../DB/DB.access';
import { ITotal } from '../app.model';
import { DeleteRecordComponent } from '../delete-record/delete-record.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-all-meal-records',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatDialogModule],
  providers: [DbAccess],
  templateUrl: './all-meal-records.component.html',
})
export class AllMealRecordsComponent {
  totalMealDetails: ITotal[] = [];
  pageLoading = true;
  constructor(private _db: DbAccess, private dialog: MatDialog) {}

  async ngOnInit(): Promise<void> {
    const allData = await this._db.getAllRecords();
    this.totalMealDetails = this._db
      .restructureTheData(allData.result)
      .sort((a, b) => a.todayDate?.getUTCDate()! - b.todayDate?.getUTCDate()!);
    this.pageLoading = false;
  }

  deleteRecord(_id: string): void {
    this.dialog
      .open(DeleteRecordComponent, { width: '400px' })
      .afterClosed()
      .subscribe(console.log);
  }
}
