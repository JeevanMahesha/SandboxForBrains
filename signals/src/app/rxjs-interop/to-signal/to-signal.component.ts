import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, interval, map } from 'rxjs';

@Component({
  selector: 'app-to-signal',
  imports: [],
  standalone: true,
  templateUrl: './to-signal.component.html',
  styleUrl: './to-signal.component.css',
})
export class ToSignalComponent {
  currentTimestampWithoutInitialValue = toSignal(
    interval(1000).pipe(map(() => new Date().toLocaleTimeString()))
  );

  currentTimestampWithInitialValue = toSignal(
    interval(1000).pipe(map(() => new Date().toLocaleTimeString())),
    {
      initialValue: new Date().toLocaleTimeString(),
    }
  );

  welcomeMessage$ = new BehaviorSubject<string>('Hello, World!');
  welcomeMessage = toSignal(this.welcomeMessage$, {
    requireSync: true,
  });
}
