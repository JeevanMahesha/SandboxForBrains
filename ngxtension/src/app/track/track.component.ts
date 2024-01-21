import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TrackById, TrackByProp } from 'ngxtension/trackby-id-prop';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [CommonModule, TrackById, TrackByProp],
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css'],
})
export class TrackComponent {
  trackByIdArray = [
    { id: 1, name: 'bill' },
    { id: 2, name: 'bob' },
    { id: 3, name: 'billy' },
  ];

  trackByPropArray = [
    { name: 'John Doe', age: 30, Dob: '1993-01-01' },
    { name: 'Jane Doe', age: 25, Dob: '1998-02-02' },
    { name: 'Peter Parker', age: 20, Dob: '2003-03-03' },
    { name: 'Mary Jane Watson', age: 19, Dob: '2004-04-04' },
  ];

  updateTrackByIdArray() {
    this.trackByIdArray = [
      { id: 1, name: 'foo' },
      { id: 2, name: 'bob' },
      { id: 3, name: 'billy' },
    ];
  }

  updateTrackByPropArray() {
    this.trackByPropArray = [
      { name: 'John Doe', age: 30, Dob: '1993-01-01' },
      { name: 'Jeevan Mahesha', age: 25, Dob: '1998-02-02' },
      { name: 'Peter Parker', age: 20, Dob: '2003-03-03' },
      { name: 'Mary Jane Watson', age: 19, Dob: '2004-04-04' },
    ];
  }
}
