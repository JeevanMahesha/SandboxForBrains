import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="container text-center">
      <div
        style="background-color: #a8edea;"
        class="row justify-content-center m-5 p-3"
      >
        <div class="col-md-3 col-6">
          <button
            routerLink="/useClass"
            class="btn btn-primary btn-lg btn-custom"
          >
            useClass
          </button>
        </div>
        <div class="col-md-3 col-6">
          <button
            routerLink="/useExisting"
            class="btn btn-secondary btn-lg btn-custom"
          >
            useExisting
          </button>
        </div>
        <div class="col-md-3 col-6">
          <button
            routerLink="/useFactory"
            class="btn btn-success btn-lg btn-custom"
          >
            useFactory
          </button>
        </div>
        <div class="col-md-3 col-6">
          <button class="btn btn-danger btn-lg btn-custom">Button 4</button>
        </div>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: `
    .btn-custom {
      margin: 10px;
    }
  `,
})
export class AppComponent {}
