import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../Header/header.component';
import { StyleDirective } from './style.directive';

@Component({
  selector: 'app-directive-composition-api',
  standalone: true,
  template: `<app-header></app-header>
    <br />
    <br />
    <br />
    <br />
    <br />
    <div class="container text-center">
      <div class="row">
        <div class="col">
          <div class="dropdown">
            <button
              class="btn btn-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ color | titlecase }}
            </button>
            <ul class="dropdown-menu">
              <li *ngFor="let eachColor of colorList">
                <button
                  class="dropdown-item"
                  (click)="setTheColorValue(eachColor)"
                  type="button"
                >
                  {{ eachColor | titlecase }}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-6 border">
          <p class="mt-3" appStyle [myColor]="color" [myClass]="myFontClass">
            Directive Composition API works!
          </p>
        </div>
        <div class="col">
          <div class="dropdown">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ myFontClass | titlecase }}
            </button>
            <ul class="dropdown-menu">
              <li *ngFor="let eachFontClass of fontClassList">
                <button
                  class="dropdown-item"
                  (click)="setTheFontValue(eachFontClass)"
                  type="button"
                >
                  {{ eachFontClass | titlecase }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div> `,
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
