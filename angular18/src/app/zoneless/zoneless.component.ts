import { Component, inject, NgZone } from '@angular/core';

@Component({
  selector: 'app-zoneless',
  standalone: true,
  imports: [],
  templateUrl: './zoneless.component.html',
  styleUrl: './zoneless.component.css',
})
export default class ZonelessComponent {
  plainCounter = 0;

  incrementPlainCounter() {
    setInterval(() => this.plainCounter++, 1000);
  }
}
