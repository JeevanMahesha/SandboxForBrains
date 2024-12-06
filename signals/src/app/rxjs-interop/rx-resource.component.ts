import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, of } from 'rxjs';

@Component({
  selector: 'app-rx-resource',
  imports: [MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <mat-form-field>
      <input matInput placeholder="Search Value" [(ngModel)]="favoriteFood" />
    </mat-form-field>

    @for (foodName of filteredFoodNameList.value(); track $index;let idx =
    $index) {
    <h5 class="card-title">{{ idx + 1 }} {{ foodName }}</h5>
    } @empty {
    <h5 class="card-title">No food found</h5>
    }
  `,
})
export class RxResourceComponent {
  favoriteFood = signal<string | null>(null);
  #foodNameList = of([
    'Idli',
    'Vada',
    'Pongal',
    'Sambar',
    'Rasam',
    'Kuzhambu',
    'Kootu',
    'Adai',
    'Filter Coffee',
    'Sundal',
  ]);

  filteredFoodNameList = rxResource({
    request: this.favoriteFood,
    loader: ({ request: foodName }) => {
      if (!foodName) {
        return this.#foodNameList;
      }
      return this.#foodNameList.pipe(
        map((foodNameList) =>
          foodNameList.filter((name) =>
            name.toLowerCase().includes(foodName.toLowerCase())
          )
        )
      );
    },
  });
}
