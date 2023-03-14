import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'dc-api',
    loadComponent: () =>
      import(
        '../app/directive-composition-api/directive-composition-api.component'
      ).then((c) => c.DirectiveCompositionAPIComponent),
  },
  {
    path: 'paa',
    loadComponent: () =>
      import(
        '../app/performant-angular-applications/performant-angular-applications.component'
      ).then((c) => c.PerformantAngularApplicationsComponent),
  },
  {
    path: 'frg',
    canActivate: [() => true],
    loadComponent: () =>
      import(
        './functional-route-guards/functional-route-guards.component'
      ).then((c) => c.FunctionalRouteGuardsComponent),
  },
  {
    path: 'NgOptimizedImage',
    loadComponent: () =>
      import('../app/ng-optimized-image/ng-optimized-image.component').then(
        (c) => c.NgOptimizedImageComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
