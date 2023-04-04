import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'meal-form',
    pathMatch: 'full',
  },
  {
    path: 'meal-form',
    loadComponent: () =>
      import('../app/meal-form/meal-form.component').then(
        (c) => c.MealFormComponent
      ),
  },
  {
    path: 'detail-view',
    loadComponent: () =>
      import('../app/detail-total/detail-total.component').then(
        (c) => c.DetailTotalComponent
      ),
  },
  {
    path: 'all',
    loadComponent: () =>
      import('../app/all-meal-records/all-meal-records.component').then(
        (c) => c.AllMealRecordsComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
