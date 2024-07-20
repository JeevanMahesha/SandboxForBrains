import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'app-zoneless',
  standalone: true,
  imports: [AsyncPipe, NgTemplateOutlet],
  templateUrl: './zoneless.component.html',
  styleUrl: './zoneless.component.css',
})
export default class ZonelessComponent {
  plainCounter = 0;
  signalCounter = signal(0);
  counter$: Observable<number> | null = null;
  // changeDetectorRef = inject(ChangeDetectorRef);

  incrementPlainCounter() {
    setInterval(() => {
      this.plainCounter++;
      // this.changeDetectorRef.markForCheck();
    }, 1000);
  }

  incrementSignalCounter() {
    setInterval(() => this.signalCounter.set(this.signalCounter() + 1), 1000);
  }

  incrementCounter() {
    this.counter$ = interval(1000);
  }
}
