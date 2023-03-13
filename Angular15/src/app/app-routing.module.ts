import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dc-api',
    loadComponent: () =>
      import(
        '../app/directive-composition-api/directive-composition-api.component'
      ).then((c) => c.DirectiveCompositionAPIComponent),
  },
  {
    path: 'frg',
    loadComponent: () =>
      import(
        './functional-route-guards/functional-route-guards.component'
      ).then((c) => c.FunctionalRouteGuardsComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
