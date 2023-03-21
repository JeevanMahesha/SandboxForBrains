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
    path: 'detail-view',
    loadComponent: () =>
      import('../app/detail-total/detail-total.component').then(
        (c) => c.DetailTotalComponent
      ),
  },
  {
    path: 'delete',
    loadComponent: () =>
      import('../app/delete-record/delete-record.component').then(
        (c) => c.DeleteRecordComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
