import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TrackComponent } from './track/track.component';
import { InjectLazyComponent } from './inject-lazy/inject-lazy.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    TrackComponent,
    InjectLazyComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showInjectDestroyComponent = true;
  title = 'ngxtension';
}
