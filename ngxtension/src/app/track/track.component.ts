import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TrackById } from 'ngxtension/trackby-id-prop';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [CommonModule, TrackById],
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css'],
})
export class TrackComponent {
  trackByIdArray = [
    { id: 1, name: 'bill' },
    { id: 2, name: 'bob' },
    { id: 3, name: 'billy' },
  ];

  updateTrackByIdArray() {
    this.trackByIdArray = [
      { id: 1, name: 'foo' },
      { id: 2, name: 'bob' },
      { id: 3, name: 'billy' },
    ];
  }
}
