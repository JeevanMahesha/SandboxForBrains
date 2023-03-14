import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'Directive-Composition-API',
    loadComponent: () =>
      import(
        '../app/directive-composition-api/directive-composition-api.component'
      ).then((c) => c.DirectiveCompositionAPIComponent),
  },
  {
    path: 'Functional-Route-Guards',
    canActivate: [() => true],
    loadComponent: () =>
      import(
        './functional-route-guards/functional-route-guards.component'
      ).then((c) => c.FunctionalRouteGuardsComponent),
  },
  {
    path: 'Performant-Angular-Applications',
    loadComponent: () =>
      import(
        '../app/performant-angular-applications/performant-angular-applications.component'
      ).then((c) => c.PerformantAngularApplicationsComponent),
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
