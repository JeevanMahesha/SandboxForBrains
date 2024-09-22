import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [MatSelectModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export default class ShoppingCartComponent {
  foods = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
}
