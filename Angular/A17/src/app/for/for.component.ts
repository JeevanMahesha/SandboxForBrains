import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-for',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './for.component.html',
  styleUrls: ['./for.component.css'],
})
export class ForComponent {
  products = [
    { name: 'Apple', price: 1.0 },
    { name: 'Orange', price: 0.5 },
    { name: 'Banana', price: 0.25 },
  ];
}
