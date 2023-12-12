import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, interval, map } from 'rxjs';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
})
export class SwitchComponent {
  products = ['apple', 'orange', 'banana'];
  fruit$: Observable<string | null>;

  constructor() {
    const productsIndexValue = this.products
      .map((_, index) => index)
      .concat(100);
    this.fruit$ = interval(3000).pipe(
      map(() => {
        const randomIndex = productsIndexValue.at(
          Math.floor(Math.random() * productsIndexValue.length)
        );
        return this.products.at(randomIndex!) ?? null;
      })
    );
  }
}
