import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { DbAccess } from '../DB/DB.access';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ITotal } from '../app.model';
import { DeleteRecordComponent } from '../delete-record/delete-record.component';

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
  constructor(private _db: DbAccess, private dialog: MatDialog) {}

  async ngOnInit(): Promise<void> {
    const allData = await this._db.getAllRecords();
    this.totalMealDetails = this._db
      .restructureTheData(allData.result)
      .sort((a, b) => a.todayDate?.getUTCDate()! - b.todayDate?.getUTCDate()!);
    this.pageLoading = false;
  }

  deleteRecord(_id: string) {
    this.dialog
      .open(DeleteRecordComponent, { width: '400px' })
      .afterClosed()
      .subscribe(console.log);
  }
}
