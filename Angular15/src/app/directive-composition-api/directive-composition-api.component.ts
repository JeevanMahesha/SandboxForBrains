import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StyleDirective } from './style.directive';

@Component({
  selector: 'app-directive-composition-api',
  standalone: true,
  templateUrl: './directive-composition-api.component.html',
  styleUrls: ['./directive-composition-api.component.css'],
  imports: [CommonModule, StyleDirective],
})
export class DirectiveCompositionAPIComponent {
  color = 'green';
  myFontClass = 'h1';
}
