import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../Header/header.component';
import { StyleDirective } from './style.directive';

@Component({
  selector: 'app-directive-composition-api',
  standalone: true,
  templateUrl: './directive-composition-api.component.html',
  styleUrls: ['./directive-composition-api.component.css'],
  imports: [CommonModule, StyleDirective, HeaderComponent, TitleCasePipe],
})
export class DirectiveCompositionAPIComponent {
  color = 'green';
  myFontClass = 'normal';
  colorList = ['tomato', 'green', 'red', 'DodgerBlue'];
  fontClassList = ['normal', 'lighter', 'bold'];

  setTheColorValue(colorValue: string): void {
    this.color = colorValue;
  }

  setTheFontValue(fontValue: string): void {
    this.myFontClass = fontValue;
  }
}
