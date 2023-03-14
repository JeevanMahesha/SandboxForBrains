import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { accessKey as Authorization } from '../../../../../../Desktop/Python/marvelAccessKey';
import { HeaderComponent } from '../Header/header.component';
import { IPexels } from './ng-optimized-image.model';

@Component({
  selector: 'app-ng-optimized-image',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HttpClientModule, NgOptimizedImage],
  template: `<link rel="preconnect" href="https://images.pexels.com" />
    <app-header></app-header>
    <br />
    <br />
    <br />
    <div
      class="container-fluid text-center"
      *ngIf="pixelsObservable$ | async as imageDetails"
    >
      <div class="row">
        <div
          class="col-md-2 mb-2"
          *ngFor="let eachImg of imageDetails.photos; index as ind"
        >
          <img
            [ngSrc]="eachImg.src.portrait"
            [alt]="ind"
            class="img-thumbnail"
            width="800"
            height="1200"
            priority
          />
        </div>
      </div>
    </div> `,
})
export class NgOptimizedImageComponent {
  pixels_API = 'https://api.pexels.com/v1/search?query=dogs&per_page=80&page=';
  pixelsObservable$!: Observable<IPexels>;
  headers = {
    Authorization,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  constructor(private http: HttpClient) {
    const pixelObservableList = Array.from(Array(2).keys()).map((_, index) => {
      return this.http.get<IPexels>(
        this.pixels_API.concat((index + 2).toString()),
        {
          headers: this.headers,
        }
      );
    });
    this.pixelsObservable$ = forkJoin(pixelObservableList).pipe(
      map(([zeroIndexRes, firstIndexRes]) => ({
        ...zeroIndexRes,
        photos: zeroIndexRes.photos.concat(firstIndexRes.photos),
      }))
    );
  }
}
