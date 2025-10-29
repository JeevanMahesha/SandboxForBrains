import { AsyncPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import 'zone.js';
import { BaseUrlInterceptorService } from './base-url-interceptor.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="d-flex justify-content-center mt-5">
      <div class="card text-center">
        <div class="card-header">User Details</div>
        <div class="card-body">
          <h5 class="card-title">
            Hello from {{ (dataValue$ | async)?.name }}!
          </h5>
        </div>
        <div class="card-footer text-body-secondary">
          <button type="button" class="btn btn-primary" (click)="submit()">
            Next User
          </button>
        </div>
      </div>
    </div>
  `,
  imports: [HttpClientModule, AsyncPipe],
  providers: [BaseUrlInterceptorService],
})
export class AppComponent {
  httpClient = inject(HttpClient);
  dataValue$: Observable<IUser> | null = null;
  private initialCount = 0;
  endPoint = 'users/';
  submit() {
    this.initialCount = this.initialCount + 1;
    this.dataValue$ = this.httpClient
      .get<IUser>(this.endPoint.concat(this.initialCount.toString()))
      .pipe(tap(console.log));
  }
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Geo {
  lat: string;
  lng: string;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
