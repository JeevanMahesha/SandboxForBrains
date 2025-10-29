import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../app/app.module').then((m) => m.AppModule),
  },
  {
    path: 'mv15',
    loadChildren: () =>
      import('../app/material-v15-comp/material-v15-comp.module').then(
        (m) => m.MaterialV15CompModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
