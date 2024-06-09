import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { filter, take } from 'rxjs';
import { DbAccess } from '../DB/DB.access';
import { MealsConsumed } from '../app.model';
import { DeleteRecordComponent } from '../delete-record/delete-record.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    RouterLinkActive,
    RouterLink,
    MatDialogModule,
    DeleteRecordComponent,
    MatIcon,
  ],
  template: `
    <nav class="bg-gray-800 p-3">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-white font-bold text-xl">Meal Tracker</div>
        <div class="hidden md:flex space-x-4">
          <a
            [routerLink]="['/meal-form']"
            routerLinkActive="active"
            class="text-white hover:bg-white hover:text-gray-900 px-3 py-2 rounded-md"
            >Meal</a
          >
          <a
            [routerLink]="['/all']"
            routerLinkActive="active"
            class="text-white hover:bg-white hover:text-gray-900 px-3 py-2 rounded-md"
            >All Meal Records</a
          >
          <a
            (click)="deleteAllRecords()"
            class="text-white hover:bg-white hover:text-gray-900 px-3 py-2 rounded-md"
            >Delete Records</a
          >
          <a
            [routerLink]="['/detail-view']"
            routerLinkActive="active"
            class="text-white hover:bg-white hover:text-gray-900 px-3 py-2 rounded-md"
            >Detail</a
          >
          <a
            [routerLink]="['/report']"
            routerLinkActive="active"
            class="text-white hover:bg-white hover:text-gray-900 px-3 py-2 rounded-md"
            >Report</a
          >
        </div>
        <div class="md:hidden flex items-center">
          <button
            mat-icon-button
            (click)="menuOpen = !menuOpen"
            class="text-white"
          >
            <mat-icon>menu</mat-icon>
          </button>
        </div>
      </div>
      <div
        [ngClass]="{ block: menuOpen, hidden: !menuOpen }"
        class="md:hidden mt-4 flex flex-col justify-center items-center space-y-2"
      >
        <a
          [routerLink]="['/meal-form']"
          routerLinkActive="active"
          class="text-white hover:bg-white hover:text-gray-900 px-3 py-2 rounded-md"
          >Meal</a
        >
        <a
          [routerLink]="['/all']"
          routerLinkActive="active"
          class="text-white hover:bg-white hover:text-gray-900 px-3 py-2 rounded-md"
          >All Meal Records</a
        >
        <a
          (click)="deleteAllRecords()"
          class="text-white hover:bg-white hover:text-gray-900 px-3 py-2 rounded-md"
          >Delete Records</a
        >
        <a
          [routerLink]="['/detail-view']"
          routerLinkActive="active"
          class="text-white hover:bg-white hover:text-gray-900 px-3 py-2 rounded-md"
          >Detail</a
        >
        <a
          [routerLink]="['/report']"
          routerLinkActive="active"
          class="text-white hover:bg-white hover:text-gray-900 px-3 py-2 rounded-md"
          >Report</a
        >
      </div>
    </nav>
  `,
})
export class HeaderComponent {
  menuOpen = false;
  dialog = inject(MatDialog);
  private _db = inject(DbAccess);
  deleteAllRecords() {
    this.dialog
      .open(DeleteRecordComponent, { width: '500px', disableClose: true })
      .afterClosed()
      .pipe(
        take(1),
        filter((userAction: keyof typeof MealsConsumed) => userAction === 'Yes')
      )
      .subscribe(this._db.deleteAllRecords.bind(this._db));
  }
}
