import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../Header/header.component';

@Component({
  selector: 'app-functional-route-guards',
  template: `
    <app-header></app-header>
    <br />
    <br />
    <br />
    <br />
    <br />
    <div class="container text-center">
      <div class="row">
        <div class="col"></div>
        <div class="col-6 border">
          <p class="mt-3">Functional Route Guards</p>
        </div>
        <div class="col"></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, HeaderComponent],
})
export class FunctionalRouteGuardsComponent {}
