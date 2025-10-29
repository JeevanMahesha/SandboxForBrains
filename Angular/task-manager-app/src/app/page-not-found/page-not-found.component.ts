import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { interval, map, mergeMap, of, tap } from 'rxjs';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  template: `
    <div class="not-found-container">
      <div class="not-found">
        <h1>404</h1>
        <p>Page Not Found</p>

        <span *ngIf="timer$ | async as seconds"
          >We will redirect you in
          <a routerLink="/">{{ seconds }} seconds</a></span
        >
      </div>
    </div>
  `,
  styles: `
  :host {

}

.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100vw;
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
  color: #343a40;
}

.not-found {
  text-align: center;
}

.not-found h1 {
  font-size: 10rem;
  color: #dc3545;
}

.not-found p {
  font-size: 2rem;
  color: #6c757d;
  margin-top: 5rem;
}

  `,
})
export default class PageNotFoundComponent {
  timer$ = of(5).pipe(
    mergeMap((currentTimer) =>
      interval(1000).pipe(map((reduceValue) => currentTimer - reduceValue))
    ),
    tap((seconds) => {
      if (seconds === 0) {
        location.href = '/';
      }
    })
  );
}
