import {Component, inject} from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {WithRxJsService} from './with-rx-js.service';

@Component({
  selector: 'app-with-rx-js',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './with-rx-js.component.html',
  styleUrl: './with-rx-js.component.css',
  providers: [WithRxJsService]
})
export class WithRxJsComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  withRxJsService = inject(WithRxJsService);

  loadData() {
    this.withRxJsService.getTodos().subscribe((data) => {
      console.log(data);
    });

  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
];
