import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, interval, map } from 'rxjs';

@Component({
  selector: 'app-to-signal',
  standalone: true,
  template: `
    <div class="d-flex justify-content-center">
      <span
        >With out initial Value :
        <strong>{{ currentTimestampWithoutInitialValue() }}</strong></span
      >
    </div>
    <div class="d-flex justify-content-center">
      <span
        >With initial Value
        <strong>{{ currentTimestampWithInitialValue() }}</strong></span
      >
    </div>

    <div class="d-flex justify-content-center">
      <span>{{ welcomeMessage() }}</span>
    </div>
  `,
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

  constructor() {
    /*  the signal returned by `toSignal` will keep returning the last
    good value forever, as Observables which error produce no further values.
     */
    setInterval(() => {
      this.welcomeMessage$.error(new Error('An error occurred!'));
    }, 5000);
  }
}
