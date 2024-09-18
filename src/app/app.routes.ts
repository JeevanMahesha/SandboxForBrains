import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-detail-list-view/user-detail-list-view.component'),
  },
];
