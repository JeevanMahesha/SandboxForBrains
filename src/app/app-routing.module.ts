import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/meal-form/meal-form.component').then(
        (c) => c.MealFormComponent
      ),
  },
  {
    path: 'total',
    loadComponent: () =>
      import('../app/total/total.component').then((c) => c.TotalComponent),
  },
  {
    path: 'detail-view',
    loadComponent: () =>
      import('../app/detail-total/detail-total.component').then(
        (c) => c.DetailTotalComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
