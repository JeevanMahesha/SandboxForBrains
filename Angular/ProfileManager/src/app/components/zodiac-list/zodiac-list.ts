import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { zodiacSignList } from '../../constant/common';

@Component({
  selector: 'app-zodiac-list',
  templateUrl: './zodiac-list.html',
  styleUrls: ['./zodiac-list.css'],
  imports: [MatTableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ZodiacListComponent {
  zodiacSigns = Object.entries(zodiacSignList).map(([key, value]) => ({
    key,
    ...value,
  }));

  displayedColumns: string[] = ['order', 'english', 'tamil', 'tanglish'];
}
