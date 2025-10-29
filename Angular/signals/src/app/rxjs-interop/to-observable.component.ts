import { AsyncPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-to-observable',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, AsyncPipe],
  template: `
    <mat-form-field>
      <input matInput placeholder="Search Value" [(ngModel)]="favoriteFood" />
    </mat-form-field>

    <p>
      Your favorite food is:
      <strong>
        {{ favoriteFoodName$ | async }}
      </strong>
      (toObservable)
    </p>
    <p>Your favorite food is: {{ favoriteFood() }} (signal)</p>
  `,
})
export class ToObservableComponent {
  favoriteFood = signal<string | null>(null);

  favoriteFoodName$ = toObservable(this.favoriteFood).pipe(
    debounceTime(500),
    distinctUntilChanged()
  );
}
