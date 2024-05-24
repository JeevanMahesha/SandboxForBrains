import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <div
      style="background-color: #a8edea;"
      class="container text-center m-5 p-5"
    >
      <div class="row justify-content-center">
        <div class="col-md-3 col-6">
          <button class="btn btn-primary btn-lg btn-custom">Button 1</button>
        </div>
        <div class="col-md-3 col-6">
          <button class="btn btn-secondary btn-lg btn-custom">Button 2</button>
        </div>
        <div class="col-md-3 col-6">
          <button class="btn btn-success btn-lg btn-custom">Button 3</button>
        </div>
        <div class="col-md-3 col-6">
          <button class="btn btn-danger btn-lg btn-custom">Button 4</button>
        </div>
      </div>
    </div>
    <router-outlet></router-outlet>`,
  styles: `
    .btn-custom {
      margin: 10px;
    }
  `,
})
export class AppComponent {}
